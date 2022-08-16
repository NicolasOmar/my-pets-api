// MODELS
import Color from '../../db/models/color.model'
import PetType from '../../db/models/petType.model'
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'

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
  }
}

export default Queries
