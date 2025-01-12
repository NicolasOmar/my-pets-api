// DB
import Color from '@models/color.model'
import Pet from '@models/pet.model'
import PetType from '@models/petType.model'
import User from '@models/user.model'
import Event from '@models/event.model'
// INTERFACES
import { tableCases, envCases } from '@interfaces/functions'
// MOCKS
import baseData from './mocks/dbOps.mocks'

const tables = {
  user: User,
  pet: Pet,
  petType: PetType,
  color: Color,
  event: Event
}

export const populateTable = async (_case: tableCases, env: envCases = envCases.test) => {
  const data = baseData[`${env}Env`] ? baseData[`${env}Env`][_case] : []
  Array.isArray(data)
    ? await tables[_case].collection.insertMany(data.map(name => ({ name })))
    : await tables[_case].collection.insertOne(data)
}

export const clearTable = async (_case: tableCases) => await tables[_case].collection.deleteMany()

export const clearAllTables = async () =>
  await Promise.allSettled(
    Object.keys(tables).map(async table => await clearTable(table as tableCases))
  )
