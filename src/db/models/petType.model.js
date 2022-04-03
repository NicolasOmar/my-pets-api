import { model, Schema } from 'mongoose'

const petTypeSchema = new Schema({
  name: {
    type: String,
    trim: true
  }
})

petTypeSchema.methods.toJSON = function () {
  const { _id: id, name } = this
  return { id, name }
}

const PetType = model('PetType', petTypeSchema)

export default PetType
