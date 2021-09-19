import jwt from 'jsonwebtoken'
import { ApolloError, ApolloServer } from 'apollo-server-express'
// SCHEMAS SPLITED BY CONCERNS
import InputTypes from './graphql/schemas/Inputs.gql'
import EntityTypes from './graphql/schemas/Entities.gql'
import OperationTypes from './graphql/schemas/Operations.gql'
// RESOLVERS SPLITED BY OPERATIONS
import Query from './graphql/resolvers/Queries'
import Mutation from './graphql/resolvers/Mutations'
import Relationships from './graphql/resolvers/Relationships'
// MODELS
import User from './db/models/user.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from './constants/errors.json'

const server = new ApolloServer({
  typeDefs: [InputTypes, EntityTypes, OperationTypes],
  resolvers: { Query, Mutation, ...Relationships },
  context: async ({ req }) => {
    const token = req.headers['authorization']
      ? req.headers['authorization'].replace('Bearer ', '')
      : null

    if (!token) return

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const loggedUser = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!loggedUser || !token) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    return { loggedUser, token }
  }
})

export default server
