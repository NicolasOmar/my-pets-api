// EXPRESS INSTANCE
import app from './app'
// APOLLO SERVER INSTANCE
import server from './server'
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

server.applyMiddleware({ app })

app.listen(PORT, () => console.log(`Server up and working on port ${PORT}`))
