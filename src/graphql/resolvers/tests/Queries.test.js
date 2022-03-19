// QUERIES
import Query from '../Queries'
// MOCKS
import { context, getPetTypesMocks } from '../mocks/Queries.mocks.json'
import _mongoose from '../../../db/mongoose'
import PetType from '../../../db/models/petTypes.model'

describe('[Queries]', () => {
  beforeAll(async () => {
    getPetTypesMocks.forEach(async _petType => {
      const mongoPetType = new PetType({ ..._petType })
      await mongoPetType.save()
    })
  })

  afterAll(async () => {
    await PetType.deleteMany()
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
    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      expect(queryResponse).not.toBeNull()
    })
  })
})
