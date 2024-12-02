import { Schema, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// INTERFACES
import { UserInterface, UserModel } from '@interfaces/user'
// CONSTANTS
import { ERROR_MSGS } from '@constants/errors'
// FUNCTIONS
import { parseErrorMsg } from '@functions/parsers'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, parseErrorMsg.missingValue('Name')],
      minlength: [3, parseErrorMsg.minMaxValue('Name', 3, true)],
      maxlength: [25, parseErrorMsg.minMaxValue('Name', 25, false)],
      trim: true
      // validate: value => {
      //   if (!validator.isAlpha(value)) {
      //     throw { message: ERROR_MSGS.ALPHA }
      //   }
      // }
    },
    lastName: {
      type: String,
      required: [true, parseErrorMsg.missingValue('Last Name')],
      minlength: [3, parseErrorMsg.minMaxValue('Last Name', 3, true)],
      maxlength: [25, parseErrorMsg.minMaxValue('Last Name', 25, false)],
      trim: true
      // validate: value => {
      //   if (!validator.isAlpha(value)) {
      //     throw { message: ERROR_MSGS.ALPHA }
      //   }
      // }
    },
    userName: {
      type: String,
      unique: true,
      required: [true, parseErrorMsg.missingValue('Username')],
      minlength: [4, parseErrorMsg.minMaxValue('Username', 4, true)],
      maxlength: [10, parseErrorMsg.minMaxValue('Username', 10, false)],
      trim: true,
      validate: (value: string) => {
        if (!validator.isAlpha(value)) {
          throw { message: ERROR_MSGS.ALPHA }
        }
      }
    },
    email: {
      type: String,
      unique: true, // CANNOT BE OTHER EQUAL THAT THIS VALUE
      required: [true, parseErrorMsg.missingValue('Email')], // CANNOT AVOID INCLUDING THIS FIELD WHEN INSERT A NEW DOCUMENT
      trim: true, // REMOVE EMPTY SPACES BEFORE AND AFTER STRING
      lowercase: true, // CHANGE ENTIRE STRING INTO LOWERCASE
      validate: (value: string) => {
        if (!validator.isEmail(value)) {
          throw { message: ERROR_MSGS.EMAIL }
        }
      }
    },
    password: {
      type: String,
      required: [true, parseErrorMsg.missingValue('Password')],
      minlength: [6, parseErrorMsg.minMaxValue('Password', 6, true)],
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
  'pets', // WHAT DOCUMENT CONTAINER YOU ARE MAKING REFERENCE IN THE VIRTUAL PROPERTY
  {
    ref: 'Pet', // WHAT MODEL YOU ARE MAKING REFERENCE
    localField: '_id', // WHAT FIELD IN YOUR DOCUMENT IS USED TO MAKE THE RELATIONSHIP (LIKE A PRIMARY KEY)
    foreignField: 'user' // HOW IS CALLED YOUR LOCAL FIELD IN THE DOCUMENT WHICH YOU MADE THE RELATIONSHIP (LIKE A FOREIGN KEY)
  }
)

userSchema.statics.findByCredentials = async (email, password) => {
  const finded = await User.findOne({ email })

  if (!finded) {
    throw { message: ERROR_MSGS.LOGIN }
  }

  const user = await bcrypt.compare(password, finded.password)

  if (!user) {
    throw { message: ERROR_MSGS.LOGIN }
  }

  return finded
}

// ACCESIBLE TO INSTANCE
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET ?? '')

  this.tokens = this.tokens.concat({ token })
  await this.save()
  return token
}

// ACCESIBLE TO MODEL. USED TO HASH THE PASSWORD BEFORE SAVING
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(process.env.CRYPT_SALT))
  }

  next()
})

userSchema.methods.toJSON = function () {
  const userObj = this.toObject()

  delete userObj.password
  delete userObj.tokens
  delete userObj.createdAt
  delete userObj.updatedAt
  delete userObj.__v
  delete userObj._id

  return userObj
}

const User = model<UserInterface, UserModel>('User', userSchema)

export default User
