import express from 'express'
import 'hbs'
import path from 'path'

// SET EXPRESS SERVER
const app = express()
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
  const { REPOISTORY_URL, WEB_URL, API_VERSION, API_ENVIRONMENT } = process.env

  response.render('index', {
    repoUrl: REPOISTORY_URL,
    projDocsUrl: WEB_URL,
    version: `v${API_VERSION} on ${API_ENVIRONMENT} environment`
  })
})

export default app
