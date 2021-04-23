const cryptoJs = require('crypto-js')
const { ERROR_MSG } = require('../constants/errors')

const sendErrorMsg = errorMessage => {
  return { message: errorMessage }
}

const decryptPass = pass => {
  return pass
    ? cryptoJs[process.env.CRYPT_METH]
        .decrypt(pass, process.env.CRYPT_SECRET)
        .toString(cryptoJs.enc.Utf8)
    : null
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
  sendErrorMsg,
  decryptPass,
  handleErrorMessages
}
