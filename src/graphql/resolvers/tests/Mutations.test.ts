// MONGOOSE CODE RELATED
import '../../../db/mongoose'
import User from '@models/user.model'
import Pet from '@models/pet.model'
// MUTATIONS
import Mutations from '../Mutations'
import Queries from '../Queries'
// INTERFACES
import { Error } from 'mongoose'
import { UserCreateResponse, UserDocument, UserObject } from '@interfaces/user'
import { PetDocument, PetCreatePayload } from '@interfaces/pet'
import { EventObject } from '@interfaces/event'
import { MongooseId, EntityDocument } from '@interfaces/shared'
import { tableCases } from '@interfaces/functions'
// MOCKS
import { requiredFields, updateFields, createEvent } from '../mocks/Mutations.mocks.json'
import mocks from '@functions/mocks/dbOps.mocks'
// FUNCTIONS
import { generateMongooseDate, parseErrorMsg } from '@functions/parsers'
import { encryptPass } from '@functions/encrypt'
import { clearAllTables, clearTable, populateTable } from '@functions/dbOps'
// CONSTANTS
import { ERROR_MSGS } from '@constants/errors'

const newUser = {
  ...mocks.testEnv.user,
  password: encryptPass(mocks.testEnv.user.password)
} as UserObject

describe('[Mutations]', () => {
  beforeAll(async () => {
    await populateTable(tableCases.petType)
    await populateTable(tableCases.color)
  })

  afterAll(async () => await clearAllTables())

  describe('[loginUser]', () => {
    afterEach(async () => await clearTable(tableCases.user))

    describe('[HAPPY PATH]', () => {
      test('Should login a created User', async () => {
        await Mutations.createUser(null, { payload: newUser })

        const { email, password } = newUser
        const loginRes = await Mutations.loginUser(null, { payload: { email, password } })

        expect(loginRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "LOGIN" Error trying to login a non-created User', async () => {
        try {
          const { email, password } = newUser
          await Mutations.loginUser(null, { payload: { email, password } })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.LOGIN)
        }
      })

      test('Should return an "LOGIN" Error trying to login a User with a non-encrypted password', async () => {
        try {
          const { email, password } = mocks.testEnv.user
          await Mutations.loginUser(null, { payload: { email, password } })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[createUser]', () => {
    afterEach(async () => await clearTable(tableCases.user))

    describe('[HAPPY PATH]', () => {
      test('Should create a new User', async () => {
        const creationRes = await Mutations.createUser(null, { payload: newUser })
        expect(creationRes.token).toBeDefined()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return an "alreadyExists" Error by sending an already created User', async () => {
        try {
          const userCreationRes = await Mutations.createUser(null, { payload: newUser })
          expect(userCreationRes.token).toBeDefined()

          await Mutations.createUser(null, { payload: newUser })
        } catch (error) {
          expect((error as Error).message).toBe(parseErrorMsg.alreadyExists('User'))
        }
      })

      test('Should return an "LOGIN" Error trying to create an already created User', async () => {
        try {
          await Mutations.createUser(null, { payload: mocks.testEnv.user as UserObject })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.LOGIN)
        }
      })
    })
  })

  describe('[updateUser]', () => {
    afterEach(async () => await clearTable(tableCases.user))

    describe('[HAPPY PATH]', () => {
      test('Should update a created User', async () => {
        const { token } = await Mutations.createUser(null, { payload: newUser })
        const loggedUser = (await User.findOne({ 'tokens.token': token })) as UserDocument
        const updatedData = { name: 'UPDATED', lastName: 'USER' } as UserDocument

        const { name, lastName } = await Mutations.updateUser(
          null,
          { payload: updatedData },
          { loggedUser }
        )
        expect(name).toBe(updatedData.name)
        expect(lastName).toBe(updatedData.lastName)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          const loggedUser = (await User.findOne({ email: newUser.email })) as UserDocument
          const updatedData = { name: 'UPDATED', lastName: 'USER' }
          await Mutations.updateUser(null, { payload: updatedData }, { loggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "MISSING_USER_DATA" Error trying to update with missing args', async () => {
        try {
          const { token } = await Mutations.createUser(null, { payload: newUser })
          const loggedUser = (await User.findOne({ 'tokens.token': token })) as UserDocument
          const updatedData = { name: 'UPDATED', lastName: loggedUser.lastName }
          await Mutations.updateUser(null, { payload: updatedData }, { loggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.UPDATES)
        }
      })
    })
  })

  describe('[updatePass]', () => {
    afterEach(async () => await clearTable(tableCases.user))

    describe('[HAPPY PATH]', () => {
      test('Should update the password of a created User', async () => {
        const { token } = await Mutations.createUser(null, { payload: newUser })
        const loggedUser = (await User.findOne({ 'tokens.token': token })) as UserDocument
        const updatePassPayload = {
          oldPass: encryptPass(mocks.testEnv.user.password),
          newPass: encryptPass('testing')
        }
        const updateResponse = await Mutations.updatePass(
          null,
          { payload: updatePassPayload },
          { loggedUser }
        )
        expect(updateResponse).toBeTruthy()
      })
    })

    describe('[SAD PATH]', () => {
      let token = null
      let loggedUser: UserCreateResponse | null = null
      const args = jest
        .fn()
        .mockReturnValueOnce({
          oldPass: encryptPass(mocks.testEnv.user.password),
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(mocks.testEnv.user.password)
        })
        .mockReturnValueOnce({
          oldPass: null,
          newPass: encryptPass('testing')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass(mocks.testEnv.user.password),
          newPass: encryptPass('test')
        })
        .mockReturnValueOnce({
          oldPass: encryptPass('testing'),
          newPass: null
        })

      beforeEach(async () => {
        token = (await Mutations.createUser(null, { payload: newUser })).token
        loggedUser = await User.findOne({ 'tokens.token': token })
      })

      afterEach(async () => await User.deleteMany())

      test('Should return a "MISSING_USER_DATA" Error trying to update the pass of a not created user', async () => {
        try {
          const loggedUserWithEmail = (await User.findOne({ email: newUser.email })) as UserDocument
          await Mutations.updatePass(null, args(), { loggedUser: loggedUserWithEmail })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update with missing args', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser: loggedUser as UserCreateResponse })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.UPDATES)
        }
      })

      test('Should return a "PASSWORD" Error trying to update a without the old pass', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser: loggedUser as UserCreateResponse })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.PASSWORD)
        }
      })

      test('Should return a "minMaxValue" Error trying to update with a new pass with less than 6 characters', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser: loggedUser as UserCreateResponse })
        } catch (error) {
          expect((error as Error).message).toBe(parseErrorMsg.minMaxValue('Password', 6, true))
        }
      })

      test('Should return a "PASSWORD" Error trying to update with worng current/old password', async () => {
        try {
          await Mutations.updatePass(null, args(), { loggedUser: loggedUser as UserCreateResponse })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.PASSWORD)
        }
      })
    })
  })

  describe('[logout]', () => {
    afterEach(async () => await clearTable(tableCases.user))

    describe('[HAPPY PATH]', () => {
      test('Should logout created User', async () => {
        const { token } = await Mutations.createUser(null, { payload: newUser })
        const loggedUser = (await User.findOne({ 'tokens.token': token })) as UserDocument
        const logOutRes = await Mutations.logout(null, null, { loggedUser, token })

        expect(logOutRes).toBeTruthy()
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to logout without a logged token', async () => {
        try {
          const loggedUser = (await User.findOne({ email: newUser.email })) as UserDocument
          await Mutations.logout(null, null, { loggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[createPet]', () => {
    let loggedUser: UserCreateResponse
    let petInfo: PetCreatePayload

    beforeAll(async () => {
      const colorId = (await Queries.getColors()).map(({ id }) => ({ id }))[0]
      const petTypeId = (await Queries.getPetTypes()).map(({ id }) => ({ id }))[0]
      const createdUser = await Mutations.createUser(null, { payload: newUser })

      petInfo = {
        payload: {
          ...mocks.testEnv.pet,
          petType: petTypeId.id,
          hairColors: [colorId.id],
          eyeColors: [colorId.id]
        }
      }
      loggedUser = createdUser
    })

    afterAll(async () => {
      await clearTable(tableCases.pet)
      await clearTable(tableCases.user)
    })

    describe('[HAPPY PATH]', () => {
      test('Should create a pet for a logged User', async () => {
        const createPetRes = await Mutations.createPet(null, petInfo, { loggedUser })
        const keys = Object.keys(mocks.testEnv.pet) as Array<keyof PetDocument>

        keys.forEach(key => expect((mocks.testEnv.pet as PetDocument)[key]).toBe(createPetRes[key]))
      })
    })

    describe('[SAD PATH]', () => {
      beforeAll(async () => await Pet.findOneAndDelete({ name: mocks.testEnv.pet.name }))

      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          await Mutations.createPet(null, petInfo)
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to create a pet with missing args', async () => {
        const requiredPetFields = requiredFields.pet as Array<keyof PetDocument>
        await requiredPetFields.forEach(async (fieldCase: keyof PetDocument) => {
          try {
            const modifiedPet = { ...petInfo.payload } as PetDocument
            delete modifiedPet[fieldCase]

            await Mutations.createPet(null, { payload: modifiedPet }, { loggedUser })
          } catch (error) {
            expect((error as Error).message).toBe(ERROR_MSGS.UPDATES)
            // expect((error as Error).code).toBe(HTTP_CODES.UNPROCESSABLE_ENTITY)
          }
        })
      })

      test('Should return an "alreadyExists" by having created an existing Pet', async () => {
        try {
          const parsedPetInfo = petInfo
          const parsedLoggedUser = loggedUser

          await Mutations.createPet(null, parsedPetInfo, { loggedUser: parsedLoggedUser })
          await Mutations.createPet(null, parsedPetInfo, { loggedUser: parsedLoggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(
            parseErrorMsg.alreadyExists('Pet', ' with this name and pet type')
          )
          // expect(e.extensions.code).toBe(HTTP_CODES.INTERNAL_ERROR_SERVER)
        }
      })
    })
  })

  describe('[updatePet]', () => {
    let loggedUser: UserCreateResponse
    let colorList: EntityDocument[]
    let petTypeList: EntityDocument[]
    let petInfo: PetCreatePayload
    let modifiedPet: PetDocument

    beforeAll(async () => {
      colorList = await Queries.getColors()
      petTypeList = await Queries.getPetTypes()
      loggedUser = await Mutations.createUser(null, { payload: newUser })

      petInfo = {
        payload: {
          ...mocks.testEnv.pet,
          petType: petTypeList[0].id,
          hairColors: [colorList[0].id],
          eyeColors: [petTypeList[0].id]
        }
      }

      await Mutations.createPet(null, petInfo, { loggedUser })
      modifiedPet = (await Queries.getMyPets(null, modifiedPet.id, { loggedUser }))[0]
    })

    afterAll(async () => {
      await clearTable(tableCases.user)
      await clearTable(tableCases.pet)
    })

    describe('[HAPPY PATH]', () => {
      test('Should update a logged Users pet data', async () => {
        const nameToUpdate = 'modifiedTest'
        const nameModified = {
          ...modifiedPet,
          name: nameToUpdate
        } as PetDocument

        await Mutations.updatePet(
          null,
          { id: modifiedPet.id, payload: nameModified },
          { loggedUser }
        )

        const updatedPets = await Queries.getMyPets(null, modifiedPet.id, { loggedUser })
        expect(updatedPets.length).toBe(1)
        expect(updatedPets[0].name).toBe(nameToUpdate)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          const nameToUpdate = 'modifiedTest'
          const nameModified = {
            ...modifiedPet,
            name: nameToUpdate
          } as PetDocument

          await Mutations.updatePet(null, { id: modifiedPet.id, payload: nameModified })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update a pet with missing args', async () => {
        const parsedUpdateFields = Object.keys(updateFields.pet) as Array<keyof PetDocument>
        await parsedUpdateFields.forEach(async key => {
          try {
            const removedPet = {
              ...modifiedPet
            } as PetDocument
            delete removedPet[key]

            await Mutations.updatePet(
              null,
              { id: modifiedPet.id, payload: removedPet },
              {
                loggedUser: loggedUser as UserCreateResponse
              }
            )
          } catch (error) {
            expect((error as Error).message).toBe(ERROR_MSGS.UPDATES)
            // expect(e.extensions.code).toBe(HTTP_CODES.UNPROCESSABLE_ENTITY)
          }
        })
      })

      test('Should return an "alreadyExists" by trying to update the Pet with a name and petType already used', async () => {
        try {
          const createdPet = await Mutations.createPet(
            null,
            { payload: modifiedPet },
            { loggedUser }
          )
          const secondPet = (await Queries.getMyPets(null, createdPet.id, { loggedUser }))[1]

          const updatedSecondPet = {
            ...secondPet,
            name: updateFields.pet.name
          } as PetDocument

          await Mutations.updatePet(
            null,
            { id: createdPet.id, payload: updatedSecondPet },
            { loggedUser }
          )
        } catch (error) {
          expect((error as Error).message).toBe(
            parseErrorMsg.alreadyExists('Pet', ' with this name and pet type')
          )
          // expect(error.extensions.code).toBe(HTTP_CODES.INTERNAL_ERROR_SERVER)
        }
      })
    })
  })

  describe('createEvent', () => {
    let loggedUser: UserCreateResponse
    let colorList: EntityDocument[]
    let petTypeList: EntityDocument[]
    let petInfo: PetCreatePayload
    let eventToCreate: EventObject
    let _id: MongooseId

    beforeAll(async () => {
      colorList = await Queries.getColors()
      petTypeList = await Queries.getPetTypes()
      loggedUser = await Mutations.createUser(null, { payload: newUser })

      petInfo = {
        payload: {
          ...mocks.testEnv.pet,
          petType: petTypeList[0].id,
          hairColors: [colorList[0].id],
          eyeColors: [petTypeList[0].id]
        }
      }

      await Mutations.createPet(null, petInfo, { loggedUser })
      _id = (await Queries.getMyPets(null, _id.toString(), { loggedUser }))[0]._id as MongooseId

      eventToCreate = {
        ...mocks.testEnv.event,
        date: generateMongooseDate(),
        associatedPets: [_id]
      }
    })

    describe('[HAPPY PATH]', () => {
      test('Should create the event related to the created pet', async () => {
        await Mutations.createEvent(null, { payload: eventToCreate }, { loggedUser })
        const petOfTheEvent = await Queries.getPet(null, { petId: _id.toString() }, { loggedUser })

        expect(petOfTheEvent.events.length).toBe(1)
      })

      test('Should create a second event related to the created pet', async () => {
        const secondEventToCreate = {
          ...eventToCreate,
          ...createEvent.events[1]
        }

        await Mutations.createEvent(null, { payload: secondEventToCreate }, { loggedUser })
        const petOfTheEvent = await Queries.getPet(null, { petId: _id.toString() }, { loggedUser })

        expect(petOfTheEvent.events.length).toBe(2)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a "MISSING_USER_DATA" Error trying to update a not logged User', async () => {
        try {
          await Mutations.createEvent(null, { payload: eventToCreate })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a "UPDATES" Error trying to update a pet with missing args', async () => {
        const eventKeys = Object.keys(eventToCreate) as Array<keyof EventObject>
        eventKeys.forEach(async eventKey => {
          try {
            delete eventToCreate[eventKey]
            await Mutations.createEvent(null, { payload: eventToCreate }, { loggedUser })
          } catch (error) {
            expect((error as Error).message).toBe(ERROR_MSGS.UPDATES)
            // expect(e.extensions.code).toBe(HTTP_CODES.UNPROCESSABLE_ENTITY)
          }
        })
      })
    })
  })
})
