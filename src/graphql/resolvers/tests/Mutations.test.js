// MONGOOSE CODE RELATED
import mongoose from '../../../db/mongoose'
import User from '../../../mongo/user.model'
// MUTATIONS
import Mutation from '../Mutations'
// MOCKS
import { context } from '../mocks/Mutations.mocks.json'
// HELPER FUNCTIONS
import { encryptPass } from '../../../functions/parsers'
// CONSTANTS
import { ERROR_MSG } from '../../../constants/errors'

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

  afterAll(async () => await mongoose.disconnect())

  describe('[createUser]', () => {
    test('Should create a User as expected', async () => {
      const newUser = {
        ...context.newUser,
        password: encryptPass(context.newUser.password)
      }

      const mutationRes = await Mutation.createUser(null, { newUser })
      expect(mutationRes.token).toBeDefined()
    })

    test('Should return an by sending an incomplete User', async () => {
      const newUser = {
        ...context.newUser,
        password: encryptPass(context.newUser.password)
      }

      try {
        let mutationRes = await Mutation.createUser(null, { newUser })
        expect(mutationRes.token).toBeDefined()

        mutationRes = await Mutation.createUser(null, { newUser })
      } catch (e) {
        expect(e.message).toBe(ERROR_MSG.ALREADY_EXISTS('User'))
      }
    })
  })

  xdescribe('[updateUser]', () => {
    test('Should work as expected', () => {})
  })

  xdescribe('[logout]', () => {
    test('Should work as expected', () => {})
  })
})
