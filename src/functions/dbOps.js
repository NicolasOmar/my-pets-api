// DB
import Color from '../db/models/color.model'
import Pet from '../db/models/pet.model'
import PetType from '../db/models/petType.model'
import User from '../db/models/user.model'
// MOCKS
import baseData from './mocks/dbOps.mocks.json'

const tables = {
  user: User,
  pet: Pet,
  petType: PetType,
  color: Color
}

export const populateTable = async (_case, env = 'test') => {
  const _data = baseData[env][_case]
  Array.isArray(_data)
    ? await tables[_case].collection.insertMany(_data.map(name => ({ name })))
    : await tables[_case].collection.insertOne(_data)
}

export const clearTable = async _case => await tables[_case].collection.deleteMany()

export const clearAllTables = async () =>
  await Object.keys(tables).forEach(async table => await clearTable(table))
