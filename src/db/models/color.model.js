import { model, Schema } from 'mongoose'

const colorSchema = new Schema({
  name: {
    type: String,
    trim: true
  }
})

const Color = model('Color', colorSchema)

export default Color
