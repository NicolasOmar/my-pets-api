const ERROR_CODE = {
  ALREADY_EXISTS: 11000
}

const ERROR_MSG = {
  EMAIL: 'The user needs a valid mail format (@site.com) to be created',
  MIN: (control, min) => `The ${control} needs to have more that ${min} characters`,
  AMOUNT: 'The amount of the transaction should be composed by numbers only',
  DATE: 'The date of the transaction should be in a valid format (DD/MM/YYYY)',
  UPDATES: 'Invalid update data',
  LOGIN: 'Your email and/or password is incorrect. Try again with other credentials',
  AUTHENTICATE: 'Please authenticate to keep using the app',
  MISSING: value => `The user needs a valid ${value} to be created`,
  ALREADY_EXISTS: entity => `There is an already registered use ${entity}`
}

const handleErrorMessages = (error, entity) => {
  const errorMsgs = error.errors
    ? Object.keys(error.errors)
        .map(key => error.errors[key].message)
        .join(', ')
    : ERROR_MSG.ALREADY_EXISTS(entity)
  return {
    ...error,
    message: errorMsgs
  }
}

module.exports = {
  ERROR_CODE,
  ERROR_MSG,
  handleErrorMessages
}