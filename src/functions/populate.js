// DB
import PetType from '../db/models/petTypes.model'
// MOCKS
import { petTypesStart } from './mocks/populate.mocks.json'

const logger = (entity, data) => console.log(`${entity} created => ${data}`)

export const populatePetTypes = async () => {
  petTypesStart.forEach(async _petType => {
    const mongoPetType = new PetType({ ..._petType })
    const createdPetType = await mongoPetType.save()
    logger('[Pet Type]', createdPetType)
  })
}
