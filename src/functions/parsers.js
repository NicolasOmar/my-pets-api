// CONSTANTS
import { ERROR_CODE, ERROR_MSG } from '../constants/errors'

export const parseError = (error, entity) => {
  return (
    errorParsers.find(({ prop }) => error[prop])?.fn(error, entity) ||
    parseErrorMsg.ALREADY_EXISTS(entity)
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
        case ERROR_CODE.ALREADY_CREATED:
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
        case ERROR_MSG.NON_ENCRYPTED_DATA:
          return ERROR_MSG.LOGIN
        default:
          return message
      }
    }
  }
]
