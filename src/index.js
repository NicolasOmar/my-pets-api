const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('apollo-server-express')
// IMPORT EXPRESS APP
const app = require('./app')
// IMPORT SCHEMAS SPLITED IN TYPE FILES
const InputTypes = require('./graphql/schemas/Inputs')
const CustomTypes = require('./graphql/schemas/Customs')
const OperationTypes = require('./graphql/schemas/Operations')
// IMPORT RESOLVERS SPLITED BY OPERATIONS
const Query = require('./graphql/resolvers/Queries')
const Mutation = require('./graphql/resolvers/Mutations')
// IMPORT CONTEXT DATA
const User = require('./mongo/models/user.model')
// DESTRUCTURE ENVIRONMENTS VARIABLES
const { CONNECTION_URL, PORT } = process.env

const server = new ApolloServer({
  typeDefs: [InputTypes, CustomTypes, OperationTypes],
  resolvers: {
    Query,
    Mutation
  },
  context: async ({ req }) => {
    const token =
      req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')

    if (!token) return

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const loggedUser = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!loggedUser) {
      throw new Error()
    }

    return { loggedUser }
  }
})

server.applyMiddleware({ app })

mongoose
  .connect(`${CONNECTION_URL}`, {
    useNewUrlParser: true,
    useCreateIndex: true, //ACCESS TO DATA NEEDED
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(PORT, () => console.log(`Server up and working on port ${PORT}`)))
  .catch(error => console.log(error))
