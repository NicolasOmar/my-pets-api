const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('apollo-server-express')
// IMPORT EXPRESS APP
const app = require('./app')
// IMPORT SCHEMAS SPLITED IN TYPE FILES
const CustomTypes = require('./graphQl/schemas/Customs')
const OperationTypes = require('./graphQl/schemas/Operations')
// IMPORT RESOLVERS SPLITED BY OPERATIONS
const Query = require('./graphQl/resolvers/Queries')
const Mutation = require('./graphQl/resolvers/Mutations')
// IMPORT CONTEXT DATA
const User = require('./models/user.model')
// DESTRUCTURE ENVIRONMENTS VARIABLES
const { CONNECTION_URL, PORT } = process.env

const server = new ApolloServer({
  typeDefs: [CustomTypes, OperationTypes],
  resolvers: {
    Query,
    Mutation
  },
  context: async ({ req }) => {
    const token =
      req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')

    if (!token) {
      return { User }
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const loggedUser = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

    if (!loggedUser) {
      throw new Error()
    }

    return { User, loggedUser, token }
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
