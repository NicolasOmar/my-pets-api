const Queries = {
  getUser: async (_, __, { loggedUser, token }) => ({ ...loggedUser.toJSON(), token })
}

export default Queries
