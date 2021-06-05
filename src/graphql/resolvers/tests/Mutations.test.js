// MONGOOSE CODE RELATED
import mongoose from '../../../db/mongoose'
import User from '../../../mongo/user.model'
// MUTATIONS
import Mutation from '../Mutations'
// MOCKS
import { context } from '../mocks/Mutations.mocks.json'
// FUNCTIONS
import { parseErrorMsg } from '../../../functions/parsers'
import { encryptPass } from '../../../functions/encrypt'
// CONSTANTS
import { ERROR_MSG } from '../../../constants/errors'

const newUser = {
  ...context.newUser,
  password: encryptPass(context.newUser.password)
}

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

  afterAll(async () => await mongoose.disconnect())

  describe('[loginUser]', () => {
    test('Should login a Created User as expected', async () => {
      await Mutation.createUser(null, { newUser })

      const { email, password } = newUser
      const loginRes = await Mutation.loginUser(null, { email, password })

      expect(loginRes.token).toBeDefined()
    })

    test('Should return an "LOGIN" Error by login a non-created User', async () => {
      try {
        const { email, password } = newUser
        await Mutation.loginUser(null, { email, password })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
      }
    })

    test('Should return an "LOGIN" Error by login a User with a non-encrypted password', async () => {
      try {
        const { email, password } = context.newUser
        await Mutation.loginUser(null, { email, password })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
      }
    })
  })

  describe('[createUser]', () => {
    test('Should create a new User as expected', async () => {
      const creationRes = await Mutation.createUser(null, { newUser })
      expect(creationRes.token).toBeDefined()
    })

    test('Should return an "ALREADY_EXISTS" Error by sending an already created User', async () => {
      try {
        let userCreationRes = await Mutation.createUser(null, { newUser })
        expect(userCreationRes.token).toBeDefined()

        await Mutation.createUser(null, { newUser })
      } catch (error) {
        expect(error.message).toBe(parseErrorMsg.ALREADY_EXISTS('User'))
      }
    })

    test('Should return an "LOGIN" Error by sending an already created User', async () => {
      try {
        await Mutation.createUser(null, { ...context })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
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
