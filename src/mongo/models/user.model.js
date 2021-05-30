import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// ERRORS
import { ERROR_MSG } from '../../constants/errors'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ERROR_MSG.MISSING('Name')],
      minlength: [3, ERROR_MSG.MIN_MAX('Name', 3, true)],
      maxlength: [25, ERROR_MSG.MIN_MAX('Name', 25, false)],
      trim: true,
      validate: value => {
        if (!validator.isAlpha(value)) {
          throw { message: ERROR_MSG.ALPHA }
        }
      }
    },
    lastName: {
      type: String,
      required: [true, ERROR_MSG.MISSING('Last Name')],
      minlength: [3, ERROR_MSG.MIN_MAX('Last Name', 3, true)],
      maxlength: [25, ERROR_MSG.MIN_MAX('Last Name', 25, false)],
      trim: true,
      validate: value => {
        if (!validator.isAlpha(value)) {
          throw { message: ERROR_MSG.ALPHA }
        }
      }
    },
    userName: {
      type: String,
      unique: true,
      required: [true, ERROR_MSG.MISSING('Username')],
      minlength: [4, ERROR_MSG.MIN_MAX('Username', 4, true)],
      maxlength: [10, ERROR_MSG.MIN_MAX('Username', 10, false)],
      trim: true,
      validate: value => {
        if (!validator.isAlpha(value)) {
          throw { message: ERROR_MSG.ALPHA }
        }
      }
    },
    email: {
      type: String,
      unique: true, // CANNOT BE OTHER EQUAL THAT THIS VALUE
      required: [true, ERROR_MSG.MISSING('Email')], // CANNOT AVOID INCLUDING THIS FIELD WHEN INSERT A NEW DOCUMENT
      trim: true, // REMOVE EMPTY SPACES BEFORE AND AFTER STRING
      lowercase: true, // CHANGE ENTIRE STRING INTO LOWERCASE
      validate: value => {
        if (!validator.isEmail(value)) {
          throw { message: ERROR_MSG.EMAIL }
        }
      }
    },
    password: {
      type: String,
      required: [true, ERROR_MSG.MISSING('Password')],
      minlength: [6, ERROR_MSG.MIN_MAX('Password', 6, true)],
      trim: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true // ADDED TO SET 'CREATEDATE' AND 'UPDATEDATE' FIELDS, HELPING SORTING FEATURE
  }
)

// VIRTUAL IS USED TO REALTE DOCUMENTS RELATED TO THIS USER (BUT ARE NOT RELATED BY PRIMARY/FOREIGN KEY RELATIONSHIP LIKE SQL)
userSchema.virtual(
  'transactions', // WHAT DOCUMENT CONTAINER YOU ARE MAKING REFERENCE IN THE VIRTUAL PROPERTY
  {
    ref: 'Transaction', // WHAT MODEL YOU ARE MAKING REFERENCE
    localField: '_id', // WHAT FIELD IN YOUR DOCUMENT IS USED TO MAKE THE RELATIONSHIP (LIKE A PRIMARY KEY)
    foreignField: 'user' // HOW IS CALLED YOUR LOCAL FIELD IN THE DOCUMENT WHICH YOU MADE THE RELATIONSHIP (LIKE A FOREIGN KEY)
  }
)

userSchema.statics.findByCredentials = async (email, password) => {
  const finded = await User.findOne({ email })

  if (!finded) {
    throw { message: ERROR_MSG.LOGIN }
  }

  const user = await bcrypt.compare(password, finded.password)

  if (!user) {
    throw { message: ERROR_MSG.LOGIN }
  }

  return finded
}

// ACCESIBLE TO INSTANCE
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// ACCESIBLE TO MODEL. USED TO HASH THE PASSWORD BEFORE SAVING
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()

  delete userObj.password
  delete userObj.tokens
  delete userObj.createdAt
  delete userObj.updatedAt
  delete userObj.__v
  delete userObj._id

  return userObj
}

const User = mongoose.model('User', userSchema)

export default User
