// DB
import PetType from '../db/models/petTypes.model'
// MOCKS
import { petTypesStart } from './mocks/populate.mocks.json'

export const logger = (entity, data) => console.log(`${entity} created => ${data}`)

export const populatePetTypes = () => {
  return Promise.allSettled(
    petTypesStart.map(_petType => {
      return new Promise(resolve => {
        const mongoPetType = new PetType({ ..._petType })
        resolve(mongoPetType.save())
      })
    })
  )
}
