import express from 'express'
import cors from 'cors'
import { expressMiddleware } from '@as-integrations/express5'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
// import path from 'path'
import 'hbs'
// // EXPRESS INSTANCE
// import app from './server/app'
// APOLLO SERVER INSTANCE
import { server, httpServer, app } from './server/server'
// // ENVIRONMENTS VARIABLES
// const { PORT } = process.env
// SETUP PATHS
// const publicPath = path.join(__dirname, '../../public')
// const viewsPath = path.join(__dirname, '../../templates/views')
// // SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
// app.set('view engine', 'hbs')
// app.set('views', viewsPath)
// // SETUP STATIC DIRECTORY TO SERVE
// app.use(express.static(publicPath))
// MONGOOSE MODELS
import User from '@models/user.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
// DATABASE CONNECTION
import './db/mongoose'

const startServer = async () => {
  await server.start()

  // app.use('/', (_, response) => {
  //   // DESTRUCTURE ENVIRONMENTS VARIABLES
  //   const { REPOISTORY_URL, PLAYGROUND_URL, WEB_URL, API_VERSION, API_ENVIRONMENT } = process.env

  //   response.render('index', {
  //     repoUrl: REPOISTORY_URL,
  //     playgroundUrl: PLAYGROUND_URL,
  //     webClientUrl: WEB_URL,
  //     version: API_VERSION,
  //     fullVersion: `v${API_VERSION} on ${API_ENVIRONMENT} environment`
  //   })
  // })

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers['authorization']
          ? req.headers['authorization'].replace('Bearer ', '')
          : null

        if (!token) return {}

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET ?? '')
        const loggedUser = await User.findOne({
          _id: (decodedToken as jwt.JwtPayload)._id,
          'tokens.token': token
        })

        if (!loggedUser || !token) {
          throw new GraphQLError(ERROR_MSGS.MISSING_USER_DATA, {
            extensions: { code: HTTP_CODES.UNAUTHORIZED }
          })
        }

        return { loggedUser, token }
      }
    })
  )

  await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`)
}

startServer()
