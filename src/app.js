import express from 'express'
import path from 'path'
import 'hbs'
// MONGOOSE INSTANCE READY TO CONNECT
import mongoose from './db/mongoose'

// SET EXPRESS SERVER
const app = express(mongoose)
// SETUP PATHS
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
// SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set('view engine', 'hbs')
app.set('views', viewsPath)
// SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(publicPath))

app.get('/', (_, response) => {
  // DESTRUCTURE ENVIRONMENTS VARIABLES
  const { REPOISTORY_URL, PLAYGROUND_URL, WEB_URL, API_VERSION, API_ENVIRONMENT } = process.env

  response.render('index', {
    repoUrl: REPOISTORY_URL,
    playgroundUrl: PLAYGROUND_URL,
    webClientUrl: WEB_URL,
    version: `v${API_VERSION} on ${API_ENVIRONMENT} environment`
  })
})

export default app
