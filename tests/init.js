require('@babel/register')
// APP AND SERVER IMPORTS
const server = require('../src/server').default
const app = require('../src/app').default
// ENVIRONMENTS VARIABLES
const { PORT } = process.env

module.exports = () => {
  server.applyMiddleware({ app })
  app.listen(PORT, () => console.log('Test server up and working'))
}