// MONGOOSE IMPORTS
import '../../../db/mongoose'
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
let petInfo = null

describe('[Queries]', () => {
  beforeAll(async () => {
    await populateTable('petType')
    await populateTable('color')
    await Mutation.createUser(null, { newUser })

    const [colorId] = await Query.getColors()
    const [petTypeId] = await Query.getPetTypes()

    petInfo = {
      ...testEnv.pet,
      petType: petTypeId.id,
      hairColors: [colorId.id],
      eyeColors: [colorId.id]
    }
    
    const petResponse = await Mutation.createPet(null, { petInfo }, { loggedUser: testEnv.user })
    
    petInfo = {
      ...petInfo,
      _id: petResponse._id
    }
    
    const eventInfo = {
      ...testEnv.event,
      date: new Date(),
      associatedPets: [petInfo._id]
    }

    await Mutation.createEvent(null, { eventInfo }, { loggedUser: testEnv.user })
  })

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
    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      expect(queryResponse.length).toEqual(testEnv.petType.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(testEnv.petType[i]))
    })
  })

  describe('[getColors]', () => {
    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(testEnv.color.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(testEnv.color[i]))
    })
  })

  describe('[getMyPets]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return an array of pets', async () => {
        const [getPet] = await Query.getMyPets(null, null, { loggedUser: testEnv.user })
        Object.keys(petInfo).forEach(key => expect(petInfo[key]).toStrictEqual(getPet[key]))
      })

      test('Should return an array of pets if I search for a part of the name', async () => {
        const petsResult = await Query.getMyPets(
          null,
          { search: 'te' },
          { loggedUser: testEnv.user }
        )

        expect(petsResult.length).toBe(1)
        expect(petsResult[0].name).toBe(testEnv.pet.name)
      })

      test('Should return an empty array of pets if I search for wrong names', async () => {
        const emptyResult = await Query.getMyPets(
          null,
          { search: 'pet' },
          { loggedUser: testEnv.user }
        )

        expect(emptyResult.length).toBe(0)
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
        const getPetInfo = await Query.getPet(null, { id: petInfo._id }, { loggedUser: testEnv.user })

        Object.keys(testEnv.pet).forEach(key =>
          expect(testEnv.pet[key]).toStrictEqual(getPetInfo[key])
        )
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getPet(null, { id: petInfo._id }, {})
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

  describe('[getMyPetEvents]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return the list of events', async () => {
        const getEventsInfo = await Query.getMyPetEvents(null, { petId: petInfo._id }, { loggedUser: testEnv.user })
        expect(testEnv.event.description).toStrictEqual(getEventsInfo[0].description)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPetEvents(null, { petId: petInfo._id }, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a MISSING_PET_DATA error by not passing the Pet ID', async () => {
        try {
          await Query.getMyPetEvents(null, { petId: null }, { loggedUser: testEnv.user })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_PET_DATA)
        }
      })
    })
  })
})
