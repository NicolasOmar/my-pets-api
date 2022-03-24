// QUERIES
import Query from '../Queries'
// MOCKS
import { context, getPetTypeMocks, getColorMocks } from '../mocks/Queries.mocks.json'
import _mongoose from '../../../db/mongoose'
import PetType from '../../../db/models/petType.model'
import Color from '../../../db/models/color.model'

const insertMocks = [
  {
    mockArray: getPetTypeMocks,
    model: PetType
  },
  {
    mockArray: getColorMocks,
    model: Color
  }
]

const fillTestDb = async i => {
  const { mockArray, model } = insertMocks[i]
  await model.collection.insertMany(mockArray)
}

describe('[Queries]', () => {
  afterAll(async () => {
    await insertMocks.forEach(async ({ model }) => await model.deleteMany())
    await _mongoose.disconnect()
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
    beforeAll(async () => await fillTestDb(0))

    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      expect(queryResponse).not.toBeNull()
    })
  })

  describe('[getColors]', () => {
    beforeAll(async () => await fillTestDb(1))

    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(getColorMocks.length)
      queryResponse.forEach((_res, i) => expect(_res.name).toEqual(getColorMocks[i].name))
    })
  })
})
