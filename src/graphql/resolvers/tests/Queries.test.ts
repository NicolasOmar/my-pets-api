// MONGOOSE IMPORTS
import '../../../db/mongoose'
// QUERIES
import Query from '../Queries'
import Mutation from '../Mutations'
// MOCKS
// import { context } from '../mocks/Queries.mocks.json'
import mocks from '@functions/mocks/dbOps.mocks'
// INTERFACES
import { tableCases } from '@interfaces/functions'
import { PetDocument, PetCreatePayload, PetObjectSimple } from '@interfaces/pet'
import { UserAndToken, UserCreateResponse, UserObject } from '@interfaces/user'
// FUNCTIONS
import { clearAllTables, populateTable } from '@functions/dbOps'
import { encryptPass } from '@functions/encrypt'
import { generateMongooseDate } from '@functions/parsers'
// CONSTANTS
import { ERROR_MSGS } from '@constants/errors'
import { MongooseId } from '@interfaces/shared'

const parseDocumentToSimple = (document: PetDocument) => ({
  name: document.name,
  petType: document.petType,
  birthday: document.birthday,
  isAdopted: document.isAdopted,
  adoptionDate: document.adoptionDate,
  weight: document.weight,
  gender: document.gender,
  hairColors: document.hairColors.map(color => color),
  eyeColors: document.eyeColors.map(color => color),
  hasHeterochromia: document.hasHeterochromia,
  passedAway: document.passedAway
})

const newUser = {
  ...mocks.testEnv.user,
  password: encryptPass(mocks.testEnv.user.password)
} as UserObject
let petInfo: PetCreatePayload
let createdPet: PetDocument
let loggedUser: UserCreateResponse
let token: string
let context: UserAndToken

describe('[Queries]', () => {
  beforeAll(async () => {
    await populateTable(tableCases.petType)
    await populateTable(tableCases.color)
    const newUserResponse = await Mutation.createUser(null, { payload: newUser })
    loggedUser = newUserResponse
    token = newUserResponse.token

    const [colorId] = await Query.getColors()
    const [petTypeId] = await Query.getPetTypes()

    petInfo = {
      payload: {
        ...mocks.testEnv.pet,
        petType: petTypeId._id,
        hairColors: [colorId._id],
        eyeColors: [colorId._id]
      }
    }

    createdPet = await Mutation.createPet(null, petInfo, { loggedUser })

    const eventInfo = {
      ...mocks.testEnv.event,
      date: generateMongooseDate(),
      associatedPets: [createdPet._id as MongooseId]
    }

    await Mutation.createEvent(null, { payload: eventInfo }, { loggedUser })

    context = {
      loggedUser,
      token
    }
  })

  afterAll(async () => await clearAllTables())

  describe('[getUser]', () => {
    test('Should return a logged user with its token', async () => {
      const queryResponse = await Query.getUser(null, null, context)
      expect(queryResponse).toEqual({
        ...context.loggedUser,
        token: context.token
      })
    })
  })

  describe('[getPetTypes]', () => {
    test('Should return an array of pet types', async () => {
      const queryResponse = await Query.getPetTypes()
      expect(queryResponse.length).toEqual(mocks.testEnv.petType.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(mocks.testEnv.petType[i]))
    })
  })

  describe('[getColors]', () => {
    test('Should return an array of colors', async () => {
      const queryResponse = await Query.getColors()
      expect(queryResponse.length).toEqual(mocks.testEnv.color.length)
      queryResponse.forEach(({ name }, i) => expect(name).toEqual(mocks.testEnv.color[i]))
    })
  })

  describe('[getMyPets]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return an array of pets', async () => {
        const [getPet] = await Query.getMyPets(null, undefined, { loggedUser })
        const petKeys = Object.keys(petInfo.payload) as Array<keyof PetObjectSimple>
        const formatterResponse = parseDocumentToSimple(getPet)
        petKeys.forEach(key => expect(petInfo.payload[key]).toStrictEqual(formatterResponse[key]))
      })

      test('Should return an array of pets if I search for a part of the name', async () => {
        const petsResult = await Query.getMyPets(null, 'te', { loggedUser })

        expect(petsResult.length).toBe(1)
        expect(petsResult[0].name).toBe(mocks.testEnv.pet.name)
      })

      test('Should return an empty array of pets if I search for wrong names', async () => {
        const emptyResult = await Query.getMyPets(null, 'pet', { loggedUser })

        expect(emptyResult.length).toBe(0)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPets(null, undefined)
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[getPet]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return one of my pets', async () => {
        const getPetInfo = await Query.getPet(
          null,
          { petId: createdPet._id.toString() },
          { loggedUser }
        )

        const petKeys = Object.keys(petInfo.payload) as Array<keyof PetObjectSimple>

        const formatterResponse = parseDocumentToSimple(getPetInfo)
        petKeys.forEach(key => expect(petInfo.payload[key]).toStrictEqual(formatterResponse[key]))
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getPet(null, { petId: createdPet._id.toString() })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a MISSING_PET_DATA error by not passing the Pet ID', async () => {
        try {
          await Query.getPet(null, { petId: '' }, { loggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_PET_DATA)
        }
      })
    })
  })

  describe('[getMyPetsPopulation]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return my pets population', async () => {
        const getPopulationInfo = await Query.getMyPetsPopulation(null, null, {
          loggedUser
        })
        const [petType] = await Query.getPetTypes()

        expect(getPopulationInfo).toStrictEqual([
          { name: 'All', quantity: 1 },
          { name: petType.name, quantity: 1 }
        ])
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPetsPopulation(null, null)
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })

  describe('[getMyPetEvents]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should return the list of events', async () => {
        const getEventsInfo = await Query.getMyPetEvents(
          null,
          { petId: createdPet._id.toString() },
          { loggedUser }
        )
        expect(mocks.testEnv.event.description).toStrictEqual(getEventsInfo[0].description)
      })
    })

    describe('[SAD PATH]', () => {
      test('Should return a USER_MISSING_DATA error by not passing the loggedUser', async () => {
        try {
          await Query.getMyPetEvents(null, { petId: createdPet._id.toString() })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })

      test('Should return a MISSING_PET_DATA error by not passing the Pet ID', async () => {
        try {
          await Query.getMyPetEvents(null, { petId: '' }, { loggedUser })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_PET_DATA)
        }
      })
    })
  })

  describe('[getEvent]', () => {
    describe('[HAPPY PATH]', () => {
      test('Should retrieve an existing Event', async () => {
        const getEventsInfo = await Query.getMyPetEvents(
          null,
          { petId: createdPet._id.toString() },
          { loggedUser }
        )

        const retrievedEvent = await Query.getEvent(
          null,
          { eventId: getEventsInfo[0]._id.toString() },
          { loggedUser }
        )
        expect(retrievedEvent).toBeDefined()
        expect(retrievedEvent._id.toString()).toBe(getEventsInfo[0]._id.toString())
      })
    })

    describe('[SAD PATH]', () => {
      test('Should throw an error if user data is missing', async () => {
        try {
          await Query.getEvent(null, { eventId: 'invalid-id' })
        } catch (error) {
          expect((error as Error).message).toBe(ERROR_MSGS.MISSING_USER_DATA)
        }
      })
    })
  })
})
