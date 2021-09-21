// MONGOOSE CODE RELATED
import mongoose from '../../../db/mongoose'
import User from '../../../db/models/user.model'
// MUTATIONS
import Mutation from '../Mutations'
// MOCKS
import { context, requiredCases } from '../mocks/Mutations.mocks.json'
// FUNCTIONS
import { parseErrorMsg } from '../../../functions/parsers'
import { encryptPass } from '../../../functions/encrypt'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../../constants/errors.json'

const newUser = {
  ...context.newUser,
  password: encryptPass(context.newUser.password)
}

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

  afterAll(async () => await mongoose.connection.close())

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
      test('Should return an "alreadyExists" Error by sending an already created User', async () => {
        try {
          const userCreationRes = await Mutation.createUser(null, { newUser })
          expect(userCreationRes.token).toBeDefined()

          await Mutation.createUser(null, { newUser })
        } catch (error) {
          expect(error.message).toBe(parseErrorMsg.alreadyExists('User'))
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
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          const updatedData = { name: 'UPDATED', lastName: 'USER' }
          await Mutation.updateUser(null, updatedData, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "MISSING_USER_DATA" Error trying to update with missing args', async () => {
        try {
          const { token } = await Mutation.createUser(null, { newUser })
          const loggedUser = await User.findOne({ 'tokens.token': token })
          const updatedData = { name: 'UPDATED' }
          await Mutation.updateUser(null, updatedData, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.UPDATES)
        }
      })
    })
  })

  describe('[updatePass]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should update the password of a created User', async () => {
        const { token } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const args = {
          oldPass: encryptPass(context.newUser.password),
          newPass: encryptPass('testing')
        }
        const updateResponse = await Mutation.updatePass(null, args, { loggedUser })
        expect(updateResponse).toBeTruthy()
      })
    })

    describe('[SAD PATH]', () => {
      let token = null
      let loggedUser = null
      const args = jest
        .fn()
        .mockReturnValueOnce({
          oldPass: encryptPass(context.newUser.password),
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(context.newUser.password)
        })
        .mockReturnValueOnce({
          oldPass: null,
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(context.newUser.password),
          newPass: encryptPass('test')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass('testing'),
          newPass: null
        })

      beforeEach(async () => {
        token = (await Mutation.createUser(null, { newUser })).token
        loggedUser = await User.findOne({ 'tokens.token': token })
      })

      afterEach(async () => await User.deleteMany())

      test('Should return a "MISSING_USER_DATA" Error trying to update the pass of a not created user', async () => {
        try {
          const loggedUserWithEmail = await User.findOne({ email: newUser.email })
          await Mutation.updatePass(null, args(), { loggedUserWithEmail })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update with missing args', async () => {
        try {
          await Mutation.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.UPDATES)
        }
      })

      test('Should return a "PASSWORD" Error trying to update a without the old pass', async () => {
        try {
          await Mutation.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.PASSWORD)
        }
      })

      test('Should return a "minMaxValue" Error trying to update with a new pass with less than 6 characters', async () => {
        try {
          await Mutation.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(parseErrorMsg.minMaxValue('Password', 6, true))
        }
      })

      test('Should return a "PASSWORD" Error trying to update with worng current/old password', async () => {
        try {
          await Mutation.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.PASSWORD)
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
      test('Should return a "MISSING_USER_DATA" Error trying to logout without a logged token', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          await Mutation.logout(null, null, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[createPet]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should create a pet for a logged User', async () => {
        const { userName } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ userName })

        const createPetRes = await Mutation.createPet(null, context, { loggedUser })

        Object.keys(context.petInfo).forEach(key =>
          expect(createPetRes[key]).toBe(context.petInfo[key])
        )
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "missingValue" error for each null required field value', async () => {
        const { userName } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ userName })

        requiredCases.pet.forEach(async ({ field, message }) => {
          try {
            const petInfo = { ...context.petInfo }
            delete petInfo[field]
            await Mutation.createPet(null, { petInfo }, { loggedUser })
          } catch (e) {
            expect(e.message).toBe(parseErrorMsg.missingValue(message))
            expect(e.extensions.code).toBe(HTTP_CODES.INTERNAL_ERROR_SERVER)
          }
        })
      })
    })
  })
})
