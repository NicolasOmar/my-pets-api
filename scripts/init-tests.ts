import 'tsconfig-paths/register'
import '@babel/register'
// APP AND SERVER IMPORTS
import server from '../src/server/server'
import app from '../src/server/app'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

export default async () => {
  await server.start()
  server.applyMiddleware({ app })
  app.listen(PORT)
}