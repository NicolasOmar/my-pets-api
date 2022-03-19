import PetTypes from '../../db/models/petTypes.model'

const Queries = {
  getUser: async (_, __, { loggedUser, token }) => {
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      token
    }
  },
  getPetTypes: async () => (await PetTypes.find()).map(({ _id, name }) => ({ id: _id, name }))
}

export default Queries
