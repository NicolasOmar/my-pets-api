// DB
import Color from '../db/models/color.model'
import PetType from '../db/models/petType.model'
// MOCKS
import { petTypeSeeds, colorSeeds } from './mocks/populate.mocks.json'

const tables = {
  petType: {
    mockedData: petTypeSeeds,
    model: PetType
  },
  color: {
    mockedData: colorSeeds,
    model: Color
  }
}

export const fillDbWithMocks = async _case => {
  const { mockedData, model } = tables[_case]
  await model.collection.insertMany(mockedData.map(name => ({ name })))
}

export const clearMockedTable = async _case => await tables[_case].model.deleteMany()
