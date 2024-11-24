import { model, Schema } from 'mongoose'
import { SelectableDataDocument } from '@interfaces/documents'
// import { parseAuxiliaryData } from '@functions/parsers'

const petTypeSchema = new Schema<SelectableDataDocument>({
  name: {
    type: String,
    trim: true
  }
})

// petTypeSchema.methods.toJSON = function () {
//   return parseAuxiliaryData(this)
// }

const PetType = model('PetType', petTypeSchema)

export default PetType
