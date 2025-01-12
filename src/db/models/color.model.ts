import { model, Schema } from 'mongoose'
import { EntityDocument } from '@interfaces/shared'
// import { parseAuxiliaryData } from '@functions/parsers'

const colorSchema = new Schema({
  name: {
    type: String,
    trim: true
  }
})

// colorSchema.methods.toJSON = function () {
//   return parseAuxiliaryData(this)
// }

const Color = model<EntityDocument>('Color', colorSchema)

export default Color
