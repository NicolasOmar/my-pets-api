// EXPRESS INSTANCE
import { expressMiddleware } from '@as-integrations/express5'
// APOLLO SERVER INSTANCE
import { app, server } from '../dist/server/server'
// FUNCTIONS
import { clearAllTables, populateTable } from '../dist/functions/dbOps'
import '../dist/db/mongoose'

const runDbGenerator = async () => {
  const [_, __, closeTime = null] = process.argv
  const exitIn = (closeTime !== 0 && closeTime > 0 && !!closeTime && +closeTime) || 5

  await server.start()

  app.use(
    '/graphql',
    expressMiddleware(server)
  )

  console.log('Database population process started')

  try {
    await clearAllTables()
    await populateTable('color', 'prod')
    await populateTable('petType', 'prod')
  } catch (e) {
    throw Error(`Error: ${e}`)
  } finally {
    console.log(`Database population process finished. Exiting in ${exitIn} seconds...`)
    setTimeout(() => process.exit(0), (exitIn * 1000))
  }
}

runDbGenerator()