// EXPRESS INSTANCE
import app from '../src/app'
import { dropTables, insertColors, insertPetTypes } from '../src/functions/populate'
// APOLLO SERVER INSTANCE
import server from '../src/server'

server.applyMiddleware({ app })

const runDbGenerator = async () => {
  console.log('Database population process started')

  try {
    await dropTables()
  } catch (e) {
    throw Error(`Error: ${e}`)
  }

  try {
    await insertPetTypes()
    await insertColors()
  } catch (e) {
    throw Error(`Error: ${e}`)
  } finally {
    console.log('Database population process finished')
    setTimeout(() => process.exit(0), 50)
  }
}

runDbGenerator()
