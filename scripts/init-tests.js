import '@babel/register'
// APP AND SERVER IMPORTS
const server = require('../src/server/server').default
const app = require('../src/server/app').default
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

export default async () => {
  await server.start()
  server.applyMiddleware({ app })
  app.listen(PORT)
}