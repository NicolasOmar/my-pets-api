const { gql } = require('apollo-server-express')

const Operations = gql`
  type Query {
    userName: String!
    getUser: User!
  }

  type Mutation {
    loginUser(email: String!, password: String!): User
    createUser(name: String!, lastName: String!, email: String!, password: String!): User
    logout: Boolean!
  }
`

module.exports = Operations
