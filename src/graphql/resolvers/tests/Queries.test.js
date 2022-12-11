// MONGOOSE IMPORTS
import _mongoose from '../../../db/mongoose'
// QUERIES
import Query from '../Queries'
import Mutation from '../Mutations'
// MOCKS
import { context } from '../mocks/Queries.mocks.json'
import { testEnv } from '../../../functions/mocks/dbOps.mocks.json'
// FUNCTIONS
import { clearAllTables, populateTable } from '../../../functions/dbOps'
import { encryptPass } from '../../../functions/encrypt'
// CONSTANTS
import { ERROR_MSGS } from '../../../constants/errors.json'

const newUser = {
  ...testEnv.user,
  password: encryptPass(testEnv.user.password)
}
let petId = null

describe('[Queries]', () => {
  afterAll(async () => await clearAllTables())

  describe('[getUser]', () => {
    test('Should return a logged user with its token', async () => {
      const queryResponse = await Query.getUser(null, {}, context)
      expect(queryResponse).toEqual({
        ...context.loggedUser,
        token: context.token
      })
    })
  })

  describe('[getPetTypes]', () => {
    beforeAll(async () => await populateTable('petType'))

    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      expect(queryResponse.length).toEqual(testEnv.petType.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(testEnv.petType[i]))
    })
  })

  describe('[getColors]', () => {
    beforeAll(async () => await populateTable('color'))

    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(testEnv.color.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(testEnv.color[i]))
    })
  })

  describe('[getMyPets]', () => {
    beforeAll(async () => await Mutation.createUser(null, { newUser }))

    describe('[HAPPY PATH]', () => {
      test('Should return an array of pets', async () => {
        const [colorId] = await Query.getColors()
        const [petTypeId] = await Query.getPetTypes()

        const petInfo = {
          ...testEnv.pet,
          petType: petTypeId.id,
          hairColors: [colorId.id],
          eyeColors: [colorId.id]
        }

        const { _id } = await Mutation.createPet(null, { petInfo }, { loggedUser: testEnv.user })
        const [getPet] = await Query.getMyPets(null, null, { loggedUser: testEnv.user })

        petId = _id

        Object.keys(petInfo).forEach(key => expect(petInfo[key]).toStrictEqual(getPet[key]))
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPets(null, null, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[getPet]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return one of my pets', async () => {
        const getPetInfo = await Query.getPet(null, { id: petId }, { loggedUser: testEnv.user })

        Object.keys(testEnv.pet).forEach(key =>
          expect(testEnv.pet[key]).toStrictEqual(getPetInfo[key])
        )
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getPet(null, { id: petId }, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a MISSING_PET_DATA error by not passing the Pet ID', async () => {
        try {
          await Query.getPet(null, { id: null }, { loggedUser: testEnv.user })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_PET_DATA)
        }
      })
    })
  })

  describe('[getMyPetsPopulation]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return my pets population', async () => {
        const getPopulationInfo = await Query.getMyPetsPopulation(null, null, {
          loggedUser: testEnv.user
        })
        const [petType] = await Query.getPetTypes()

        expect(getPopulationInfo).toStrictEqual([
          { name: 'All', quantity: 1 },
          { name: petType.name, quantity: 1 }
        ])
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPetsPopulation(null, null, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })
})
