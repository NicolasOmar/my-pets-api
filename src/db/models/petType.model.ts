import { EntityDocument } from '@interfaces/shared'
import { model, Schema } from 'mongoose'
// import { parseAuxiliaryData } from '@functions/parsers'

const petTypeSchema = new Schema({
  name: {
    type: String,
    trim: true
  }
})

// petTypeSchema.methods.toJSON = function () {
//   return parseAuxiliaryData(this)
// }

const PetType = model<EntityDocument>('PetType', petTypeSchema)

export default PetType
