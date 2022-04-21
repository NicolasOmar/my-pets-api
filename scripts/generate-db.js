// EXPRESS INSTANCE
import app from '../src/server/app'
import { dropTables, insertColors, insertPetTypes } from '../src/functions/populate'
// APOLLO SERVER INSTANCE
import server from '../src/server/server'

const runDbGenerator = async () => {
  const [_, __, closeTime = null] = process.argv
  const exitIn = (closeTime !== 0 && !!closeTime && +closeTime) || 5

  await server.start()
  server.applyMiddleware({ app })

  console.log('Database population process started')

  try {
    await dropTables()
    await insertPetTypes()
    await insertColors()
  } catch (e) {
    throw Error(`Error: ${e}`)
  } finally {
    console.log(`Database population process finished. Exiting in ${exitIn} seconds...`)
    setTimeout(() => process.exit(0), (exitIn * 1000))
  }
}

runDbGenerator()