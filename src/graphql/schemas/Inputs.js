const { gql } = require('apollo-server-express')

const Inputs = gql`
  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }
`

module.exports = Inputs
