// DB
import Color from '../db/models/color.model'
import Pet from '../db/models/pet.model'
import PetType from '../db/models/petType.model'
import User from '../db/models/user.model'
import Event from '../db/models/event.model'
// MOCKS
import baseData from './mocks/dbOps.mocks.json'

const tables = {
  user: User,
  pet: Pet,
  petType: PetType,
  color: Color,
  event: Event
}

export const populateTable = async (_case, env = 'test') => {
  const data = baseData[`${env}Env`] ? baseData[`${env}Env`][_case] : []
  Array.isArray(data)
    ? await tables[_case].collection.insertMany(data.map(name => ({ name })))
    : await tables[_case].collection.insertOne(data)
}

export const clearTable = async _case => await tables[_case].collection.deleteMany()

export const clearAllTables = async () =>
  await Promise.allSettled(Object.keys(tables).map(async table => await clearTable(table)))
