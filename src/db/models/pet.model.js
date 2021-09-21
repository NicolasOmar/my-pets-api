import { model, Schema } from 'mongoose'
import validator from 'validator'
// FUNCTIONS
import { parseErrorMsg } from '../../functions/parsers'

const validateDate = (value, field, beforeDate = null) => {
  if (value) {
    switch (value) {
      case !validator.isDate(value):
        throw { message: parseErrorMsg.invalidDateFormat(field) }
      case beforeDate && !validator.isBefore(value):
        throw { message: parseErrorMsg.invalidDateBefore(field, beforeDate) }
    }
  }
}

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, parseErrorMsg.missingValue('Name')],
    minlength: [2, parseErrorMsg.minMaxValue('Name', 3, true)],
    maxlength: [20, parseErrorMsg.minMaxValue('Name', 25, false)],
    trim: true
  },
  petType: {
    type: Number,
    required: [true, parseErrorMsg.missingValue('Pet Type')]
  },
  birthday: {
    type: Date,
    validate: value => validateDate(value, 'birthday', '1/1/1900')
  },
  isAdopted: {
    type: Boolean
  },
  adoptionDate: {
    type: Date,
    validate: value => validateDate(value, 'adoption date', '1/1/1900')
  },
  height: {
    type: Number,
    min: 0,
    required: [true, parseErrorMsg.missingValue('Height')]
  },
  length: {
    type: Number,
    required: [true, parseErrorMsg.missingValue('Length')],
    min: 0
  },
  weight: {
    type: Number,
    required: [true, parseErrorMsg.missingValue('Weight')],
    min: 0
  },
  gender: {
    type: Boolean,
    required: [true, parseErrorMsg.missingValue('Gender')]
  },
  hairColor: {
    type: Number,
    required: [true, parseErrorMsg.missingValue('Hair Color')]
  },
  eyeColor: {
    type: Number,
    required: [true, parseErrorMsg.missingValue('Eye Color')]
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
