// CONSTANTS
import { MONGO_CODES, ERROR_MSGS } from '../constants/errors.json'

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
          return parseErrorMsg.alreadyExists(entity)
        default:
          return parseErrorMsg.noIdeaCode(code)
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

export const parseError = (error, entity) => {
  return (
    errorParsers.find(({ prop }) => error[prop])?.fn(error, entity) ||
    parseErrorMsg.alreadyExists(entity)
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
  minMaxValue: (control, value, isMinValue) =>
    `The ${control} needs to have ${isMinValue ? 'more' : 'less'} than ${value} characters`,
  missingValue: (value, entity = 'User') => `The ${entity} needs a valid ${value} to be created`,
  alreadyExists: (entity = 'Entity') => `There is an already created ${entity}`,
  invalidDateFormat: (field = 'date') =>
    `The provided ${field} should be in a valid format (DD/MM/YYYY)`,
  invalidDateBefore: (field = 'date', date) => `The provided ${field} should be after ${date}`,
  noIdeaCode: code => `No idea dude, the code ${code} has not been mapped so far`
}

export const parsedAuxiliaryData = ({ _id: id, name }) => ({ id, name })

export const findIds = async (model, ids, findOne = false) => {
  if (findOne) {
    const modelFinded = await model.findOne({ _id: ids })
    return parsedAuxiliaryData(modelFinded)
  }

  return (await model.find().where('_id').in(ids)).map(data => parsedAuxiliaryData(data))
}
