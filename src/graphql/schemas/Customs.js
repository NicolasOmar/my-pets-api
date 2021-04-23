const { gql } = require('apollo-server-express')

const CustomTypes = gql`
  type User {
    name: String!
    lastName: String!
    email: String!
    password: String!
    token: String!
  }
`

module.exports = CustomTypes
