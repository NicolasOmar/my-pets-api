// EXPRESS INSTANCE
import app from './server/app'
// APOLLO SERVER INSTANCE
import server from './server/server'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

const startServer = async () => {
  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () => console.log(`Server up and working on port ${PORT}`))
}

startServer()
