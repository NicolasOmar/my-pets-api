// DB
import Color from '../db/models/color.model'
import PetType from '../db/models/petType.model'
// MOCKS
import { petTypeSeeds, colorSeeds } from './mocks/populate.mocks.json'

export const insertNewData = (seeds, model) => {
  return model && Array.isArray(seeds) && seeds.length
    ? Promise.allSettled([
        seeds.map(name => {
          return new Promise(resolve => {
            const mongoObj = new model({ name })
            resolve(mongoObj.save())
          })
        })
      ])
    : new Promise(resolve => resolve(null))
}

export const clearTables = (tables = []) => {
  return Array.isArray(tables) && tables.length
    ? Promise.allSettled([tables.map(table => new Promise(resolve => resolve(table.deleteMany())))])
    : new Promise(resolve => resolve(null))
}

export const insertPetTypes = async () => await insertNewData(petTypeSeeds, PetType)

export const insertColors = async () => await insertNewData(colorSeeds, Color)

export const dropTables = async () => await clearTables([PetType, Color])
