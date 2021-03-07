const Queries = {
  getUser: async (_, __, { loggedUser, token }) => {
    console.log(loggedUser)
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      token
    }
  }
}

module.exports = Queries
