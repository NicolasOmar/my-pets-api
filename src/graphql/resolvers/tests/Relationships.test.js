// MONGOOSE CODE RELATED
import _mongoose from '../../../db/mongoose'
import User from '../../../db/models/user.model'
import PetType from '../../../db/models/petType.model'
import Color from '../../../db/models/color.model'
import Pet from '../../../db/models/pet.model'
// GRAPHQL
import Mutations from '../Mutations'
import Queries from '../Queries'
import Relationships from '../Relationships'
// MOCKS
import { testUser, testPet } from '../mocks/Relationships.mocks.json'
// FUNCTIONS
import { encryptPass } from '../../../functions/encrypt'
import { insertColors, insertPetTypes } from '../../../functions/populate'

const checkObjectData = (mock, response) =>
  Object.keys(mock).forEach(key => expect(mock[key]).toStrictEqual(response[key]))

describe('[Relationships]', () => {
  let loggedUser = null
  let createdPet = null
  let selectedPetType = null
  let selectedColor = null

  beforeAll(async () => {
    const newUser = {
      ...testUser,
      password: encryptPass(testUser.password)
    }

    await insertPetTypes()
    await insertColors()
    loggedUser = await Mutations.createUser(null, { newUser })
    const [petType] = await Queries.getPetTypes()
    const [color] = await Queries.getColors()

    const petInfo = {
      ...testPet,
      petType: petType.id,
      hairColor: [color.id],
      eyeColor: [color.id]
    }

    selectedPetType = petType
    selectedColor = color
    createdPet = await Mutations.createPet(null, { petInfo }, { loggedUser })
  })

  afterAll(async () => {
    await PetType.deleteMany()
    await Color.deleteMany()
    await Pet.deleteMany()
    await User.deleteMany()
  })

  describe('[User]', () => {
    test('pets', async () => {
      const [testPetsRes] = await Relationships.User.pets({ userName: loggedUser.userName })
      checkObjectData(createdPet, testPetsRes)

      const testNoPetsRes = await Relationships.User.pets({})
      expect(testNoPetsRes).toEqual([])
    })
  })

  describe('[Pet]', () => {
    test('user', async () => {
      const { token, ...userData } = loggedUser
      const testUserRes = await Relationships.Pet.user({ user: createdPet.user })
      checkObjectData(userData, testUserRes)
    })

    test('petType', async () => {
      const testPetTypeRes = await Relationships.Pet.petType({ petType: selectedPetType.id })
      checkObjectData(selectedPetType, testPetTypeRes)
    })

    test('hairColors', async () => {
      const [testHairColorsRes] = await Relationships.Pet.hairColors({
        hairColors: [selectedColor.id]
      })
      checkObjectData(selectedColor, testHairColorsRes)
    })

    test('eyeColors', async () => {
      const [testEyeColorsRes] = await Relationships.Pet.eyeColors({
        eyeColors: [selectedColor.id]
      })
      checkObjectData(selectedColor, testEyeColorsRes)
    })
  })
})
