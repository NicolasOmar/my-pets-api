// MODELS
import Color from '../../db/models/color.model'
import PetType from '../../db/models/petType.model'
import Pet from '../../db/models/pet.model'

const Queries = {
  getUser: async (_, __, { loggedUser, token }) => ({
    name: loggedUser.name,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    token
  }),
  getPetTypes: async () => (await PetType.find()).map(({ _id, name }) => ({ id: _id, name })),
  getColors: async () => (await Color.find()).map(({ _id, name }) => ({ id: _id, name })),
  getMyPets: async (_, __, { loggedUser }) => await Pet.find({ user: loggedUser._id })
}

export default Queries
