// MONGOOSE IMPORTS
import _mongoose from '../../../db/mongoose'
// QUERIES
import Query from '../Queries'
import Mutation from '../Mutations'
// MOCKS
import { context } from '../mocks/Queries.mocks.json'
import mocks from '../../../functions/mocks/dbOps.mocks.json'
// FUNCTIONS
import { clearTable, populateTable } from '../../../functions/dbOps'
import { encryptPass } from '../../../functions/encrypt'

const newUser = {
  ...mocks.test.user,
  password: encryptPass(mocks.test.user.password)
}

describe('[Queries]', () => {
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
      expect(queryResponse.length).toEqual(mocks.test.petType.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(mocks.test.petType[i]))
    })
  })

  describe('[getColors]', () => {
    beforeAll(async () => await populateTable('color'))

    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(mocks.test.color.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(mocks.test.color[i]))
    })
  })

  describe('[getMyPets]', () => {
    beforeAll(async () => {
      await Mutation.createUser(null, { newUser })
    })

    afterAll(async () => {
      await clearTable('petType')
      await clearTable('color')
      await clearTable('user')
    })

    test('Should return an array of pets', async () => {
      const [colorId] = await Query.getColors()
      const [petTypeId] = await Query.getPetTypes()

      const petInfo = {
        ...mocks.test.pet,
        petType: petTypeId.id,
        hairColors: [colorId.id],
        eyeColors: [colorId.id]
      }

      await Mutation.createPet(null, { petInfo }, { loggedUser: mocks.test.user })

      const [getPet] = await Query.getMyPets(null, null, { loggedUser: mocks.test.user })
      Object.keys(petInfo).forEach(key => expect(petInfo[key]).toStrictEqual(getPet[key]))
    })
  })
})
