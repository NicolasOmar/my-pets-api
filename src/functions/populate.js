// DB
import Color from '../db/models/color.model'
import PetType from '../db/models/petType.model'
// MOCKS
import { petTypeSeeds, colorSeeds } from './mocks/populate.mocks.json'

const insertNewData = (seeds = [], model) => {
  return Promise.allSettled([
    seeds.map(name => {
      return new Promise(resolve => {
        const mongoObj = new model({ name })
        resolve(mongoObj.save())
      })
    })
  ])
}

const clearTables = (tables = []) => {
  return Promise.allSettled([
    tables.map(table => new Promise(resolve => resolve(table.deleteMany())))
  ])
}

export const logger = (entity, data = null) =>
  console.log(`${entity} ${data ? `created => ${data}` : 'created'}`)

export const insertPetTypes = async () => await insertNewData(petTypeSeeds, PetType)
export const insertColors = async () => await insertNewData(colorSeeds, Color)

export const dropTables = async () => await clearTables([PetType, Color])
