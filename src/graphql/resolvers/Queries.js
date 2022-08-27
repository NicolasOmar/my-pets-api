// MODELS
import Color from '../../db/models/color.model'
import PetType from '../../db/models/petType.model'
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import { ApolloError } from 'apollo-server-errors'
import { ERROR_MSGS, HTTP_CODES } from '../../constants/errors.json'

const Queries = {
  getUser: async (_, __, { loggedUser, token }) => ({
    name: loggedUser.name,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    token
  }),
  getPetTypes: async () => (await PetType.find()).map(({ _id, name }) => ({ id: _id, name })),
  getColors: async () => (await Color.find()).map(({ _id, name }) => ({ id: _id, name })),
  getMyPets: async (_, __, { loggedUser }) => {
    const { _id } = await User.findOne({ userName: loggedUser.userName })
    return await Pet.find({ user: _id })
  },
  getPet: async (_, { name }, { loggedUser }) => {
    const { _id } = await User.findOne({ userName: loggedUser.userName })
    const foundedPet = await Pet.findOne({ name, user: _id })

    if (!foundedPet) {
      throw new ApolloError(ERROR_MSGS.MISSING_PET_DATA, HTTP_CODES.NOT_FOUND)
    }

    return foundedPet
  }
}

export default Queries
