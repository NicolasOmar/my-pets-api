import { model, Schema } from 'mongoose'
import { parseErrorMsg } from '../../functions/parsers'

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, parseErrorMsg.MISSING('Name')],
    trim: true
  },
  petType: {
    type: Number,
    required: [true, parseErrorMsg.MISSING('Type')]
  },
  birthday: {
    type: Date
  },
  isAdopted: {
    type: Boolean
  },
  adoptionDate: {
    type: Date
  },
  height: {
    type: Number
  },
  length: {
    type: Number
  },
  weight: {
    type: Number
  },
  gender: {
    type: Boolean
  },
  hairColor: {
    type: Number
  },
  eyeColor: {
    type: Number
  },
  hasHeterochromia: {
    type: Boolean
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Pet = model('Pet', petSchema)

export default Pet
