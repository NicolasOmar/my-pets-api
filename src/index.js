import jwt from 'jsonwebtoken'
import { ApolloError, ApolloServer } from 'apollo-server-express'
// EXPRESS APP
import app from './app'
// SCHEMAS SPLITED BY CONCERNS
import EntityTypes from './graphql/schemas/Entities.gql'
import InputTypes from './graphql/schemas/Inputs.gql'
import OperationTypes from './graphql/schemas/Operations.gql'
// RESOLVERS SPLITED BY OPERATIONS
import Query from './graphql/resolvers/Queries'
import Mutation from './graphql/resolvers/Mutations'
// MODELS
import User from './db/models/user.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from './constants/errors.json'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

const server = new ApolloServer({
  typeDefs: [EntityTypes, InputTypes, OperationTypes],
  resolvers: {
    Query,
    Mutation
  },
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

server.applyMiddleware({ app })

app.listen(PORT, () => console.log(`Server up and working on port ${PORT}`))
