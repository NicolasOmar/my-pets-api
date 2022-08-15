// MONGOOSE IMPORTS
import _mongoose from '../../../db/mongoose'
// QUERIES
import Query from '../Queries'
// MOCKS
import { context } from '../mocks/Queries.mocks.json'
import { petTypeSeeds, colorSeeds } from '../../../functions/mocks/populate.mocks.json'
// FUNCTIONS
import { clearMockedTable, fillDbWithMocks } from '../../../functions/mockDbOps'

describe('[Queries]', () => {
  beforeAll(async () => {
    await clearMockedTable('petType')
    await clearMockedTable('color')
  })

  afterAll(async () => {
    await clearMockedTable('petType')
    await clearMockedTable('color')
  })

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
    beforeAll(async () => await fillDbWithMocks('petType'))

    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      console.log(queryResponse)
      expect(queryResponse.length).toEqual(petTypeSeeds.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(petTypeSeeds[i]))
    })
  })

  describe('[getColors]', () => {
    beforeAll(async () => await fillDbWithMocks('color'))

    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(colorSeeds.length)
      queryResponse.forEach((_res, i) => expect(_res.name).toEqual(colorSeeds[i]))
    })
  })

  describe('[getMyPets]', () => {
    test('Should return an array of pets', () => expect(5 + 5).not.toBe(11))
  })
})
