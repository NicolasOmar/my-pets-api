// MONGOOSE CODE RELATED
import mongoose from '../../../db/mongoose'
import User from '../../../db/models/user.model'
// MUTATIONS
import Mutation from '../Mutations'
// MOCKS
import { context } from '../mocks/Mutations.mocks.json'
// FUNCTIONS
import { parseErrorMsg } from '../../../functions/parsers'
import { encryptPass } from '../../../functions/encrypt'
// CONSTANTS
import { ERROR_MSGS } from '../../../constants/errors.json'

const newUser = {
  ...context.newUser,
  password: encryptPass(context.newUser.password)
}

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

  afterAll(async () => await mongoose.disconnect())

  describe('[loginUser]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should login a created User', async () => {
        await Mutation.createUser(null, { newUser })

        const { email, password } = newUser
        const loginRes = await Mutation.loginUser(null, { email, password })

        expect(loginRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "LOGIN" Error trying to login a non-created User', async () => {
        try {
          const { email, password } = newUser
          await Mutation.loginUser(null, { email, password })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })

      test('Should return an "LOGIN" Error trying to login a User with a non-encrypted password', async () => {
        try {
          const { email, password } = context.newUser
          await Mutation.loginUser(null, { email, password })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[createUser]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should create a new User', async () => {
        const creationRes = await Mutation.createUser(null, { newUser })
        expect(creationRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
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
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[updateUser]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should update a created User', async () => {
        const { token } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const updatedData = { name: 'UPDATED', lastName: 'USER' }

        const { name, lastName } = await Mutation.updateUser(null, updatedData, { loggedUser })
        expect(name).toBe(updatedData.name)
        expect(lastName).toBe(updatedData.lastName)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" trying to update a not logged User', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          const updatedData = { name: 'UPDATED', lastName: 'USER' }
          await Mutation.updateUser(null, updatedData, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[logout]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should logout created User', async () => {
        const { token } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const logOutRes = await Mutation.logout(null, null, { loggedUser, token })

        expect(logOutRes).toBeTruthy()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" trying to logout without a logged token', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          await Mutation.logout(null, null, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })
})
