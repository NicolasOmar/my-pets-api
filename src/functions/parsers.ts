// INTERFACES
import mongoose, { Model } from 'mongoose'
import {
  MongooseDate,
  MongooseId,
  MongooseString,
  EntityObject,
  EntityDocument
} from '@interfaces/shared'
// CONSTANTS
import { ERROR_MSGS, SERVER_MSGS } from '@constants/errors'

interface FindByTsIdsParams {
  model: Model<EntityDocument>
  ids: MongooseString | MongooseString[]
  parser?: string
}

interface ParseUniqueArrayParams<ListType, CallbackType> {
  list: ListType[]
  callback?: (item: ListType, itemI: number) => CallbackType
}

export const checkAllowedUpdates: <T extends object>(obj: T, allowedFields: string[]) => boolean = (
  obj,
  allowedFields
) => {
  const updateFields = Object.keys(obj)

  return (
    updateFields.length === allowedFields.length &&
    updateFields.every(update => allowedFields.includes(update))
  )
}

export const parseErrorMsg = {
  minMaxValue: (control: string, value: string | number, isMinValue: boolean) =>
    `The field ${control} needs to have ${isMinValue ? 'more' : 'less'} than ${value} characters`,
  missingValue: (value: string | number, entity: string = 'User') =>
    `The ${entity} needs a valid ${value} to be created`,
  alreadyExists: (entity = 'Entity', additionalText = '') =>
    `There is an already created ${entity}${additionalText}`,
  invalidDateFormat: (field = 'date') =>
    `The provided ${field} should be in a valid format (DD/MM/YYYY)`,
  invalidDateBefore: (field = 'date', date: Date | string) =>
    `The provided ${field} should be after ${date}`,
  noIdeaCode: (code: string) => `No idea dude, the code ${code} has not been mapped so far`
}

export const findByIds: (
  request: FindByTsIdsParams
) => Promise<EntityObject | EntityObject[]> = async ({ model, ids, parser = '_id name' }) => {
  const findByManyIds = Array.isArray(ids)

  if (findByManyIds) {
    const findedList = await model.find().where('_id').in(ids).select(parser)
    return findedList
      ? findedList.map(({ _id, name }) => ({ id: _id as MongooseId, name: name }))
      : []
  } else {
    const findedUnit = (await model.findOne({ _id: ids }, parser)) as EntityDocument
    return { id: findedUnit._id, name: findedUnit.name } as EntityObject
  }
}

export const parseUniqueArray: <ListType, CallbackType>({
  list,
  callback
}: ParseUniqueArrayParams<ListType, CallbackType>) => ListType[] | CallbackType[] = ({
  list,
  callback
}) => {
  const isAnArray = Array.isArray(list)

  if (isAnArray) {
    const setFromArray = Array.from(new Set(list))
    return callback ? setFromArray.map((item, i) => callback(item, i)) : setFromArray
  } else {
    return []
  }
}

export const generateMongooseDate = () => {
  const date = new Date().toJSON().split('T')[0]
  return date as unknown as MongooseDate
}

export const parseErrorMessage: (error: unknown, entityName?: string) => string = (
  error,
  entityName
) => {
  const { message } = error as mongoose.Error
  const failedValidationMsg = `${entityName ?? 'Entity'} ${SERVER_MSGS.FAILED_VALIDATION}`

  if (message.startsWith(SERVER_MSGS.IS_DUPLICATED)) {
    return parseErrorMsg.alreadyExists(entityName)
  }

  if (message.split(failedValidationMsg).length > 1) {
    return message.split(': ')[2]
  }

  switch (message) {
    case SERVER_MSGS.MISSING_ENCRYPTION:
      return ERROR_MSGS.NEEDS_ENCRYPTION
    default:
      return message
  }
}
