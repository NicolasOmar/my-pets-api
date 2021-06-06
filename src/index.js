import jwt from 'jsonwebtoken'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
// EXPRESS APP
import app from './app'
// SCHEMAS SPLITED BY CONCERNS
import InputTypes from './graphql/schemas/Inputs.gql'
import CustomTypes from './graphql/schemas/Customs.gql'
import OperationTypes from './graphql/schemas/Operations.gql'
// RESOLVERS SPLITED BY OPERATIONS
import Query from './graphql/resolvers/Queries'
import Mutation from './graphql/resolvers/Mutations'
// MODELS
import User from './db/models/user.model'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

const server = new ApolloServer({
  typeDefs: [CustomTypes, InputTypes, OperationTypes],
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

    if (!loggedUser) {
      throw new AuthenticationError()
    }

    return { loggedUser, token }
  }
})

server.applyMiddleware({ app })

app.listen(PORT, () => console.log(`Server up and working on port ${PORT}`))
