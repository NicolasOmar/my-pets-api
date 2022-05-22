import _mongoose from '../../db/mongoose'
import Queries from '../../graphql/resolvers/Queries'
// FUNCIONS
import { clearTables, dropTables, insertColors, insertNewData, insertPetTypes } from '../populate'
// MOCKS
import mocks from '../mocks/populate.mocks.json'

describe('[Populate]', () => {
  beforeAll(async () => {
    await insertPetTypes(mocks.petTypeSeeds)
    await insertColors(mocks.colorSeeds)
  })

  describe('[dropTables]', () => {
    test('Should delete every table data', async () => {
      let testPetTypeRes = await Queries.getPetTypes()
      let testColorsRes = await Queries.getColors()
      await dropTables()

      testPetTypeRes = await Queries.getPetTypes()
      testColorsRes = await Queries.getColors()
      expect(testPetTypeRes).toStrictEqual([])
      expect(testColorsRes).toStrictEqual([])
    })

    test('Should return a null value by sending empty values', async () => {
      const testEmptyParams = await clearTables()
      const testNotArrayParams = await clearTables({})
      expect(testEmptyParams).toBeNull()
      expect(testNotArrayParams).toBeNull()
    })
  })

  describe('[insertNewData]', () => {
    test('Should return a null value by sending empty values', async () => {
      const testEmptyParams = await insertNewData()
      const testNoModel = await insertNewData([])
      expect(testEmptyParams).toBeNull()
      expect(testNoModel).toBeNull()
    })
  })
})
