// CONSTANTS
import { MONGO_CODES, ERROR_MSGS } from '../constants/errors.json'

export const parseError = (error, entity) => {
  return (
    errorParsers.find(({ prop }) => error[prop])?.fn(error, entity) ||
    parseErrorMsg.ALREADY_EXISTS(entity)
  )
}

export const checkAllowedUpdates = (obj, allowedFields) => {
  const updateFields = Object.keys(obj)

  return (
    updateFields.length === allowedFields.length &&
    updateFields.every(update => allowedFields.includes(update))
  )
}

export const parseErrorMsg = {
  MIN_MAX: (control, value, isMinValue) =>
    `The ${control} needs to have ${isMinValue ? 'more' : 'less'} than ${value} characters`,
  MISSING: value => `The user needs a valid ${value} to be created`,
  ALREADY_EXISTS: entity => `There is an already created ${entity || 'Entity'}`,
  NO_IDEA_CODE: code => `No idea dude, the code ${code} has not been mapped so far`
}

const errorParsers = [
  {
    prop: 'errors',
    fn: ({ errors }) =>
      Object.keys(errors)
        .map(key => errors[key].message)
        .join(', ')
  },
  {
    prop: 'code',
    fn: ({ code }, entity) => {
      switch (code) {
        case MONGO_CODES.ALREADY_CREATED:
          return parseErrorMsg.ALREADY_EXISTS(entity)
        default:
          return parseErrorMsg.NO_IDEA_CODE(code)
      }
    }
  },
  {
    prop: 'message',
    fn: ({ message }) => {
      switch (message) {
        case ERROR_MSGS.NON_ENCRYPTED_DATA:
          return ERROR_MSGS.LOGIN
        default:
          return message
      }
    }
  }
]
