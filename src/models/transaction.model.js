const mongoose = require('mongoose')
// ERRORS
const { ERROR_MSG } = require('../../config/errors')

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, ERROR_MSG.MISSING('Title')],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: [true, ERROR_MSG.MISSING('Amount')]
    },
    date: {
      type: Date,
      required: [true, ERROR_MSG.MISSING('Date')],
      min: new Date('1/1/2000')
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
