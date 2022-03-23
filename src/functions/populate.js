// DB
import PetType from '../db/models/petTypes.model'
// MOCKS
import { petTypeSeeds } from './mocks/populate.mocks.json'

export const logger = (entity, data) => console.log(`${entity} created => ${data}`)

export const populatePetTypes = () => {
  return Promise.allSettled([
    ...petTypeSeeds.map(name => {
      return new Promise(resolve => {
        const mongoPetType = new PetType({ name })
        resolve(mongoPetType.save())
      })
    })
  ])
}

export const dropTables = () => {
  return Promise.allSettled([new Promise(resolve => resolve(PetType.deleteMany()))])
}
