import { model, Schema } from 'mongoose'
import { parseErrorMsg } from '../../functions/parsers'

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, parseErrorMsg.MISSING('Name')],
    minlength: [2, parseErrorMsg.MIN_MAX('Name', 3, true)],
    maxlength: [20, parseErrorMsg.MIN_MAX('Name', 25, false)],
    trim: true
  },
  petType: {
    type: Number,
    required: [true, parseErrorMsg.MISSING('Pet Type')]
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
    type: Number,
    min: 0,
    required: [true, parseErrorMsg.MISSING('Height')]
  },
  length: {
    type: Number,
    min: 0,
    required: [true, parseErrorMsg.MISSING('Length')]
  },
  weight: {
    type: Number,
    min: 0,
    required: [true, parseErrorMsg.MISSING('Weight')]
  },
  gender: {
    type: Boolean,
    required: [true, parseErrorMsg.MISSING('Gender')]
  },
  hairColor: {
    type: Number,
    required: [true, parseErrorMsg.MISSING('Gender')]
  },
  eyeColor: {
    type: Number,
    required: [true, parseErrorMsg.MISSING('Gender')]
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
