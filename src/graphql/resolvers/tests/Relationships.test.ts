// MONGOOSE CODE RELATED
import '../../../db/mongoose'
// GRAPHQL
import Mutations from '../Mutations'
import Queries from '../Queries'
import Relationships from '../Relationships'
// INTERFACES
import { tableCases } from '@interfaces/functions'
import { UserCreateResponse, UserObject } from '@interfaces/user'
import { PetDocument } from '@interfaces/pet'
// import { EventDocument } from '@interfaces/event'
// import { MongooseId, EntityDocument } from '@interfaces/shared'
import { EntityDocument, MongooseId } from '@interfaces/shared'
// MOCKS
import mocks from '@functions/mocks/dbOps.mocks'
// FUNCTIONS
import { encryptPass } from '@functions/encrypt'
import { clearAllTables, populateTable } from '@functions/dbOps'
import { generateMongooseDate } from '@functions/parsers'
import { EventDocument } from '@interfaces/event'
// import { generateMongooseDate } from '@functions/parsers'

const checkObjectData: <T extends object>(mock: T, response: T) => void = (mock, response) => {
  const keyList = Object.keys(mock) as Array<keyof object>
  return keyList.forEach(key => expect(mock[key]).toStrictEqual(response[key]))
}

describe('[Relationships]', () => {
  let loggedUser: UserCreateResponse
  let createdPet: PetDocument
  let selectedPetType: EntityDocument
  let selectedColor: EntityDocument
  let createdEvent: EventDocument

  beforeAll(async () => {
    const newUser = {
      ...mocks.testEnv.user,
      password: encryptPass(mocks.testEnv.user.password)
    } as UserObject

    await populateTable(tableCases.petType)
    await populateTable(tableCases.color)

    loggedUser = await Mutations.createUser(null, { payload: newUser })
    const [petType] = await Queries.getPetTypes()
    const [color] = await Queries.getColors()

    const petInfo = {
      ...mocks.testEnv.pet,
      petType: petType.id,
      hairColors: [color.id],
      eyeColors: [color.id]
    }

    selectedPetType = petType
    selectedColor = color
    createdPet = await Mutations.createPet(null, { payload: petInfo }, { loggedUser })

    const eventInfo = {
      ...mocks.testEnv.event,
      date: generateMongooseDate(),
      associatedPets: [createdPet._id] as MongooseId[]
    }

    createdEvent = await Mutations.createEvent(null, { payload: eventInfo }, { loggedUser })
    createdPet = {
      ...createdPet,
      events: [createdEvent._id] as MongooseId[]
    } as PetDocument
  })

  afterAll(async () => await clearAllTables())

  describe('[User]', () => {
    test('pets', async () => {
      const [testPetsRes] = await Relationships.User.pets({ userName: loggedUser.userName })
      checkObjectData(createdPet, testPetsRes)

      const testNoPetsRes = await Relationships.User.pets({ userName: '' })
      expect(testNoPetsRes).toEqual([])
    })
  })

  describe('[Pet]', () => {
    test('user', async () => {
      const testUserRes = await Relationships.Pet.user({ user: createdPet.user.toString() })
      const formatterUser = {
        ...testUserRes?.toJSON(),
        token: testUserRes?.tokens[0].token
      }
      checkObjectData(loggedUser, formatterUser as UserCreateResponse)
    })

    test('petType', async () => {
      const testPetTypeRes = await Relationships.Pet.petType({
        petType: selectedPetType.id.toString()
      })
      const formattedPetType = {
        id: (selectedPetType._id as MongooseId).toString(),
        name: selectedPetType.name
      }
      checkObjectData(formattedPetType, testPetTypeRes)
    })

    test('hairColors', async () => {
      const testHairColorsRes = await Relationships.Pet.hairColors({
        hairColors: selectedColor.id.toString()
      })
      const formattedHairColor = {
        id: (selectedColor._id as MongooseId).toString(),
        name: selectedColor.name
      }
      checkObjectData(formattedHairColor, testHairColorsRes)
    })

    test('eyeColors', async () => {
      const testEyeColorsRes = await Relationships.Pet.eyeColors({
        eyeColors: selectedColor.id.toString()
      })
      const formattedEyeColor = {
        id: (selectedColor._id as MongooseId).toString(),
        name: selectedColor.name
      }
      checkObjectData(formattedEyeColor, testEyeColorsRes)
    })

    // test('events', async () => {
    //   const [testEventsRes] = await Relationships.Pet.events({
    //     events: [createdEvent._id]
    //   })
    //   checkObjectData({ ...createdEvent, __v: undefined }, testEventsRes)
    // })
  })

  // describe('[Event]', () => {
  //   test('associatedPets', async () => {
  //     const parsedMockPet = { ...createdPet, __v: undefined, user: undefined, events: undefined }
  //     const [testPetsRes] = await Relationships.Event.associatedPets({
  //       associatedPets: [createdPet._id]
  //     })
  //     checkObjectData(parsedMockPet, testPetsRes)
  //   })
  // })
})
