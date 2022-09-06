import { model, Schema } from 'mongoose'
// import validator from 'validator'
// FUNCTIONS
import { parseErrorMsg } from '../../functions/parsers'

// const validateDate = (value, field, beforeDate = null) => {
//   if (value) {
//     switch (value) {
//       case !validator.isDate(value):
//         throw { message: parseErrorMsg.invalidDateFormat(field) }
//       case beforeDate && !validator.isBefore(value):
//         throw { message: parseErrorMsg.invalidDateBefore(field, beforeDate) }
//     }
//   }
// }

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, parseErrorMsg.missingValue('Name')],
    minlength: [2, parseErrorMsg.minMaxValue('Name', 3, true)],
    maxlength: [20, parseErrorMsg.minMaxValue('Name', 25, false)],
    trim: true
  },
  petType: {
    type: Schema.Types.ObjectId,
    required: [true, parseErrorMsg.missingValue('Pet Type')],
    ref: 'PetType'
  },
  birthday: {
    type: Date
    // validate: value => validateDate(value, 'birthday', '1/1/1900')
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
    type: String,
    required: [true, parseErrorMsg.missingValue('Gender')]
  },
  hairColors: {
    type: [Schema.Types.ObjectId],
    required: [true, parseErrorMsg.missingValue('Hair Color')],
    ref: 'Color'
  },
  eyeColors: {
    type: [Schema.Types.ObjectId],
    required: [true, parseErrorMsg.missingValue('Eye Color')],
    ref: 'Color'
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
