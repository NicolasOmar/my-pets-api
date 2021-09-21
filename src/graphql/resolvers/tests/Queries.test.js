// QUERIES
import Query from '../Queries'
// MOCKS
import context from '../mocks/Queries.mocks.json'

describe('[Queries]', () => {
  describe('[getUser]', () => {
    test('Should return a good value', async () => {
      const queryResponse = await Query.getUser(null, {}, context)
      expect(queryResponse).toEqual({
        ...context.loggedUser,
        token: context.token
      })
    })
  })
})
