// MONGOOSE CODE RELATED
import _mongoose from '../../../db/mongoose'
import User from '../../../db/models/user.model'
import Color from '../../../db/models/color.model'
// MUTATIONS
import Mutation from '../Mutations'
// MOCKS
import { requiredCases } from '../mocks/Mutations.mocks.json'
import { testEnv } from '../../../functions/mocks/dbOps.mocks.json'
// FUNCTIONS
import { parseErrorMsg } from '../../../functions/parsers'
import { encryptPass } from '../../../functions/encrypt'
import { clearTable, populateTable } from '../../../functions/dbOps'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../../constants/errors.json'
import PetType from '../../../db/models/petType.model'

const newUser = {
  ...testEnv.user,
  password: encryptPass(testEnv.user.password)
}

describe('[Mutations]', () => {
  afterEach(async () => await User.deleteMany())

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
          const { email, password } = testEnv.user
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
          await Mutation.createUser(null, { newUser: testEnv.user })
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
          oldPass: encryptPass(testEnv.user.password),
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
          oldPass: encryptPass(testEnv.user.password),
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(testEnv.user.password)
        })
        .mockReturnValueOnce({
          oldPass: null,
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(testEnv.user.password),
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
    beforeAll(async () => {
      await populateTable('petType')
      await populateTable('color')
    })

    afterAll(async () => {
      await clearTable('petType')
      await clearTable('color')
      await clearTable('pet')
    })

    describe('[HAPPY PATH]', () => {
      test('Should create a pet for a logged User', async () => {
        const { userName } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ userName })
        const [colorId] = (await Color.find()).map(({ _id }) => ({ id: _id }))
        const [petTypeId] = (await PetType.find()).map(({ _id }) => ({ id: _id }))

        const petInfo = {
          ...testEnv.pet,
          petType: petTypeId.id,
          hairColor: [colorId.id],
          eyeColor: [colorId.id]
        }
        const createPetRes = await Mutation.createPet(null, { petInfo }, { loggedUser })

        Object.keys(testEnv.pet).forEach(key => expect(createPetRes[key]).toBe(testEnv.pet[key]))
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "missingValue" error for each null required field value', async () => {
        const { userName } = await Mutation.createUser(null, { newUser })
        const loggedUser = await User.findOne({ userName })
        const [colorId] = (await Color.find()).map(({ _id }) => ({ id: _id }))
        const [petTypeId] = (await PetType.find()).map(({ _id }) => ({ id: _id }))

        requiredCases.pet.forEach(async ({ field, message }) => {
          try {
            const petInfo = {
              ...testEnv.pet,
              petType: petTypeId.id,
              hairColors: [colorId.id],
              eyeColors: [colorId.id]
            }
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
