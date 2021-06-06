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
import { ERROR_MSG } from '../../../constants/errors.json'

const newUser = {
  ...context.newUser,
  password: encryptPass(context.newUser.password)
}

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

  afterAll(async () => await mongoose.disconnect())

  describe('[loginUser]', () => {
    test('Should login a created User', async () => {
      await Mutation.createUser(null, { newUser })

      const { email, password } = newUser
      const loginRes = await Mutation.loginUser(null, { email, password })

      expect(loginRes.token).toBeDefined()
    })

    test('Should return an "LOGIN" Error trying to login a non-created User', async () => {
      try {
        const { email, password } = newUser
        await Mutation.loginUser(null, { email, password })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
      }
    })

    test('Should return an "LOGIN" Error trying to login a User with a non-encrypted password', async () => {
      try {
        const { email, password } = context.newUser
        await Mutation.loginUser(null, { email, password })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
      }
    })
  })

  describe('[createUser]', () => {
    test('Should create a new User', async () => {
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

    test('Should return an "LOGIN" Error trying to create an already created User', async () => {
      try {
        await Mutation.createUser(null, { ...context })
      } catch (error) {
        expect(error.message).toBe(ERROR_MSG.LOGIN)
      }
    })
  })

  xdescribe('[updateUser]', () => {
    test('Should work', () => {})
  })

  describe('[logout]', () => {
    test('Should logout created user', async () => {
      const { token } = await Mutation.createUser(null, { newUser })
      const loggedUser = await User.findOne({ 'tokens.token': token })
      const logOutRes = await Mutation.logout(null, null, { loggedUser, token })

      expect(logOutRes).toBeTruthy()
    })

    test('Should return a "MISSING_USER_DATA" trying to logout a created user', async () => {
      try {
        const loggedUser = await User.findOne({ email: newUser.email })
        await Mutation.logout(null, null, { loggedUser })
      } catch (error) {
        expect(error).toBe(ERROR_MSG.MISSING_USER_DATA)
      }
    })
  })
})
