const Queries = {
  getUser: async (_, __, { loggedUser, token }) => {
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      token
    }
  }
}

export default Queries
