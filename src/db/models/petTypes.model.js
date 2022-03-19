import { model, Schema } from 'mongoose'

const petTypeSchema = new Schema({
  type: {
    type: String,
    trim: true
  }
})

const PetType = model('PetType', petTypeSchema)

export default PetType
