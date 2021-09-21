const Queries = {
  getUser: async (_, __, { loggedUser, token }) => ({ ...loggedUser, token })
}

export default Queries
