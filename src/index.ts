import express from 'express'
import cors from 'cors'
import { expressMiddleware } from '@as-integrations/express5'
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
      context: async ({ req }) => ({ token: req.headers.token })
    })
  )

  await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`)
}

startServer()
