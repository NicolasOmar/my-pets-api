const { gql } = require('apollo-server-express')

const Operations = gql`
  type Query {
    getUser: User!
  }

  type Mutation {
    loginUser(email: String!, password: String!): User
    createUser(newUser: UserInput): User
    updateUser(name: String!, lastName: String!): User
    logout: Boolean!
    # logoutAll: Boolean!
  }
`

module.exports = Operations
