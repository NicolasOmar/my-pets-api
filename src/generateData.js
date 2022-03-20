// EXPRESS INSTANCE
import app from './app'
import { logger, populatePetTypes } from './functions/populate'
// APOLLO SERVER INSTANCE
import server from './server'

server.applyMiddleware({ app })

const runDbGenerator = async () => {
  console.log('Database population process started')

  try {
    (await populatePetTypes()).forEach(({ value }) => logger('Pet Type', value))
  } catch (e) {
    throw Error(`Error: ${e}`)
  } finally {
    console.log('Database population process finished')
  }
}

runDbGenerator()
