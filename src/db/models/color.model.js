import { model, Schema } from 'mongoose'

const colorSchema = new Schema({
  name: {
    type: String,
    trim: true
  }
})

colorSchema.methods.toJSON = function () {
  const { _id: id, name } = this
  return { id, name }
}

const Color = model('Color', colorSchema)

export default Color
