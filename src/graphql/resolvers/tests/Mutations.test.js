// MONGOOSE CODE RELATED
import _mongoose from '../../../db/mongoose'
import User from '../../../db/models/user.model'
import Color from '../../../db/models/color.model'
import PetType from '../../../db/models/petType.model'
import Pet from '../../../db/models/pet.model'
// MUTATIONS
import Mutations from '../Mutations'
import Queries from '../Queries'
// MOCKS
import { requiredFields, updateFields } from '../mocks/Mutations.mocks.json'
import { testEnv } from '../../../functions/mocks/dbOps.mocks.json'
// FUNCTIONS
import { parseErrorMsg } from '../../../functions/parsers'
import { encryptPass } from '../../../functions/encrypt'
import { clearAllTables, clearTable, populateTable } from '../../../functions/dbOps'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../../constants/errors.json'

const newUser = {
  ...testEnv.user,
  password: encryptPass(testEnv.user.password)
}

describe('[Mutations]', () => {
  beforeAll(async () => {
    await populateTable('petType')
    await populateTable('color')
  })

  afterAll(async () => await clearAllTables())

  describe('[loginUser]', () => {
    afterEach(async () => await clearTable('user'))

    describe('[HAPPY PATH]', () => {
      test('Should login a created User', async () => {
        await Mutations.createUser(null, { newUser })

        const { email, password } = newUser
        const loginRes = await Mutations.loginUser(null, { email, password })

        expect(loginRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "LOGIN" Error trying to login a non-created User', async () => {
        try {
          const { email, password } = newUser
          await Mutations.loginUser(null, { email, password })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })

      test('Should return an "LOGIN" Error trying to login a User with a non-encrypted password', async () => {
        try {
          const { email, password } = testEnv.user
          await Mutations.loginUser(null, { email, password })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[createUser]', () => {
    afterEach(async () => await clearTable('user'))

    describe('[HAPPY PATH]', () => {
      test('Should create a new User', async () => {
        const creationRes = await Mutations.createUser(null, { newUser })
        expect(creationRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "alreadyExists" Error by sending an already created User', async () => {
        try {
          const userCreationRes = await Mutations.createUser(null, { newUser })
          expect(userCreationRes.token).toBeDefined()

          await Mutations.createUser(null, { newUser })
        } catch (error) {
          expect(error.message).toBe(parseErrorMsg.alreadyExists('User'))
        }
      })

      test('Should return an "LOGIN" Error trying to create an already created User', async () => {
        try {
          await Mutations.createUser(null, { newUser: testEnv.user })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[updateUser]', () => {
    afterEach(async () => await clearTable('user'))

    describe('[HAPPY PATH]', () => {
      test('Should update a created User', async () => {
        const { token } = await Mutations.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const updatedData = { name: 'UPDATED', lastName: 'USER' }

        const { name, lastName } = await Mutations.updateUser(null, updatedData, { loggedUser })
        expect(name).toBe(updatedData.name)
        expect(lastName).toBe(updatedData.lastName)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          const updatedData = { name: 'UPDATED', lastName: 'USER' }
          await Mutations.updateUser(null, updatedData, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "MISSING_USER_DATA" Error trying to update with missing args', async () => {
        try {
          const { token } = await Mutations.createUser(null, { newUser })
          const loggedUser = await User.findOne({ 'tokens.token': token })
          const updatedData = { name: 'UPDATED' }
          await Mutations.updateUser(null, updatedData, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.UPDATES)
        }
      })
    })
  })

  describe('[updatePass]', () => {
    afterEach(async () => await clearTable('user'))

    describe('[HAPPY PATH]', () => {
      test('Should update the password of a created User', async () => {
        const { token } = await Mutations.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const args = {
          oldPass: encryptPass(testEnv.user.password),
          newPass: encryptPass('testing')
        }
        const updateResponse = await Mutations.updatePass(null, args, { loggedUser })
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
        token = (await Mutations.createUser(null, { newUser })).token
        loggedUser = await User.findOne({ 'tokens.token': token })
      })

      afterEach(async () => await User.deleteMany())

      test('Should return a "MISSING_USER_DATA" Error trying to update the pass of a not created user', async () => {
        try {
          const loggedUserWithEmail = await User.findOne({ email: newUser.email })
          await Mutations.updatePass(null, args(), { loggedUserWithEmail })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update with missing args', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.UPDATES)
        }
      })

      test('Should return a "PASSWORD" Error trying to update a without the old pass', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.PASSWORD)
        }
      })

      test('Should return a "minMaxValue" Error trying to update with a new pass with less than 6 characters', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(parseErrorMsg.minMaxValue('Password', 6, true))
        }
      })

      test('Should return a "PASSWORD" Error trying to update with worng current/old password', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.PASSWORD)
        }
      })
    })
  })

  describe('[logout]', () => {
    afterEach(async () => await clearTable('user'))

    describe('[HAPPY PATH]', () => {
      test('Should logout created User', async () => {
        const { token } = await Mutations.createUser(null, { newUser })
        const loggedUser = await User.findOne({ 'tokens.token': token })
        const logOutRes = await Mutations.logout(null, null, { loggedUser, token })

        expect(logOutRes).toBeTruthy()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to logout without a logged token', async () => {
        try {
          const loggedUser = await User.findOne({ email: newUser.email })
          await Mutations.logout(null, null, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[createPet]', () => {
    let loggedUser = null
    let petInfo = null

    beforeAll(async () => {
      const colorId = (await Color.find()).map(({ _id }) => ({ id: _id }))[0]
      const petTypeId = (await PetType.find()).map(({ _id }) => ({ id: _id }))[0]
      petInfo = {
        ...testEnv.pet,
        petType: petTypeId.id,
        hairColors: [colorId.id],
        eyeColors: [colorId.id]
      }

      loggedUser = { userName: (await Mutations.createUser(null, { newUser })).userName }
    })

    afterAll(async () => {
      await clearTable('pet')
      await clearTable('user')
    })

    describe('[HAPPY PATH]', () => {
      test('Should create a pet for a logged User', async () => {
        const createPetRes = await Mutations.createPet(null, { petInfo }, { loggedUser })

        Object.keys(testEnv.pet).forEach(key => expect(createPetRes[key]).toBe(testEnv.pet[key]))
      })
    })

    describe('[SAD PATH]', () => {
      beforeAll(async () => await Pet.findOneAndDelete({ name: testEnv.pet.name }))

      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          await Mutations.createPet(null, { petInfo }, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to create a pet with missing args', async () => {
        await requiredFields.pet.forEach(async fieldCase => {
          try {
            const modifiedPet = { ...petInfo }
            delete modifiedPet[fieldCase]

            await Mutations.createPet(null, { petInfo: modifiedPet }, { loggedUser })
          } catch (e) {
            expect(e.message).toBe(ERROR_MSGS.UPDATES)
            expect(e.extensions.code).toBe(HTTP_CODES.UNPROCESSABLE_ENTITY)
          }
        })
      })

      test('Should return an "alreadyExists" by having created an existing Pet', async () => {
        try {
          await Mutations.createPet(null, { petInfo }, { loggedUser })
        } catch (e) {
          expect(e.message).toBe(parseErrorMsg.alreadyExists('Pet', ' with this name and pet type'))
          expect(e.extensions.code).toBe(HTTP_CODES.INTERNAL_ERROR_SERVER)
        }
      })
    })
  })

  describe('[updatePet]', () => {
    let loggedUser = null
    let colorList = null
    let petTypeList = null
    let petInfo = null

    beforeAll(async () => {
      colorList = (await Color.find()).map(({ _id }) => ({ id: _id }))
      petTypeList = (await PetType.find()).map(({ _id }) => ({ id: _id }))

      loggedUser = { userName: (await Mutations.createUser(null, { newUser })).userName }

      petInfo = {
        ...testEnv.pet,
        petType: petTypeList[0].id,
        hairColors: [colorList[0].id],
        eyeColors: [petTypeList[0].id]
      }

      await Mutations.createPet(null, { petInfo }, { loggedUser })
      const [createdPet] = await Queries.getMyPets(null, null, { loggedUser })

      petInfo = {
        ...petInfo,
        id: createdPet._id
      }
    })

    describe('[HAPPY PATH]', () => {
      test('Should update a logged Users pet data', async () => {
        const nameToUpdate = 'modifiedTest'
        const modifiedPet = {
          ...petInfo,
          name: nameToUpdate
        }

        await Mutations.updatePet(null, { petInfo: modifiedPet }, { loggedUser })

        const updatedPets = await Queries.getMyPets(null, null, { loggedUser })
        expect(updatedPets.length).toBe(1)
        expect(updatedPets[0].name).toBe(nameToUpdate)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          const nameToUpdate = 'modifiedTest'
          const modifiedPet = {
            ...petInfo,
            name: nameToUpdate
          }

          await Mutations.updatePet(null, { petInfo: modifiedPet }, {})
        } catch (error) {
          expect(error.message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update a pet with missing args', async () => {
        await updateFields.pet.forEach(async ({ field, value }) => {
          try {
            const modifiedPet = {
              ...petInfo,
              [field]: value
            }
            delete modifiedPet[field]

            await Mutations.updatePet(null, { petInfo: modifiedPet }, { loggedUser })
          } catch (e) {
            expect(e.message).toBe(ERROR_MSGS.UPDATES)
            expect(e.extensions.code).toBe(HTTP_CODES.UNPROCESSABLE_ENTITY)
          }
        })
      })

      test('Should return an "alreadyExists" by trying to update the Pet with a name and petType already used', async () => {
        try {
          const { id, ...originalPet } = petInfo

          await Mutations.createPet(null, { petInfo: originalPet }, { loggedUser })
          const [_, secondPet] = await Queries.getMyPets(null, null, { loggedUser })

          const { _id, __v, user, ...updatedSecondPet } = {
            ...secondPet.toJSON(),
            ...updateFields.pet
              .map(({ field, value }) => ({ [field]: value }))
              .reduce((finalObj, currentProp) => ({ ...finalObj, ...currentProp }), {}),
            id: secondPet._id
          }

          await Mutations.updatePet(null, { petInfo }, { loggedUser })
        } catch (error) {
          expect(error.message).toBe(
            parseErrorMsg.alreadyExists('Pet', ' with this name and pet type')
          )
          expect(error.extensions.code).toBe(HTTP_CODES.INTERNAL_ERROR_SERVER)
        }
      })
    })
  })
})
