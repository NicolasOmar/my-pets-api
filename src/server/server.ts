import { ApolloServer, ApolloError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import depthLimit from 'graphql-depth-limit'
import { readFileSync } from 'fs'
// RESOLVERS SPLITED BY OPERATIONS
import Query from '@resolvers/Queries'
import Mutation from '@resolvers/Mutations'
import Relationships from '@resolvers/Relationships'
// MODELS
import User from '../db/models/user.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
// SCHEMAS SPLITED BY CONCERNS
const EntityTypes = readFileSync('./src/graphql/schemas/Entities.gql', { encoding: 'utf-8' })
const InputTypes = readFileSync('./src/graphql/schemas/Inputs.gql', { encoding: 'utf-8' })
const OperationTypes = readFileSync('./src/graphql/schemas/Operations.gql', { encoding: 'utf-8' })

const server = new ApolloServer({
  typeDefs: [EntityTypes, InputTypes, OperationTypes],
  resolvers: { Query, Mutation, ...Relationships },
  context: async ({ req }) => {
    const token = req.headers['authorization']
      ? req.headers['authorization'].replace('Bearer ', '')
      : null

    if (!token) return

    const decodedToken = (jwt.verify(token, process.env.JWT_SECRET ?? '')) as jwt.JwtPayload
    const loggedUser = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!loggedUser || !token) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    return { loggedUser, token }
  },
  validationRules: [depthLimit(3)]
})

export default server
