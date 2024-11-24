import { model, Schema } from 'mongoose'
import { SelectableDataDocument } from '@interfaces/documents'
// import { parseAuxiliaryData } from '@functions/parsers'

const colorSchema = new Schema<SelectableDataDocument>({
  name: {
    type: String,
    trim: true
  }
})

// colorSchema.methods.toJSON = function () {
//   return parseAuxiliaryData(this)
// }

const Color = model('Color', colorSchema)

export default Color
