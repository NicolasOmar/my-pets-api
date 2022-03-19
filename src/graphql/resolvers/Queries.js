import PetType from '../../db/models/petTypes.model'

const Queries = {
  getUser: async (_, __, { loggedUser, token }) => {
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      token
    }
  },
  getPetTypes: async () => (await PetType.find()).map(({ _id, type }) => ({ id: _id, name: type }))
}

export default Queries
