import CryptoJs from 'crypto-js'
import { ERROR_CODE, ERROR_MSG } from '../constants/errors'

export const sendErrorMsg = errorMessage => {
  return { message: errorMessage }
}

export const encryptPass = pass => {
  return pass
    ? CryptoJs[process.env.CRYPT_METH].encrypt(pass, process.env.CRYPT_SECRET).toString()
    : null
}

export const decryptPass = pass => {
  return pass
    ? CryptoJs[process.env.CRYPT_METH]
        .decrypt(pass, process.env.CRYPT_SECRET)
        .toString(CryptoJs.enc.Utf8)
    : null
}

export const handleErrorMessages = (error, entity) => {
  // TODO: HANDLE ERROR USING DESTRUCTURING PATTERN OR WITH A MORE ELLEGANT WAY
  return error.errors
    ? Object.keys(error.errors)
        .map(key => error.errors[key].message)
        .join(', ')
    : (error.code && parseErrorCode(error.code, entity)) ||
        (error.message && parseErrorMsg(error.message)) ||
        ERROR_MSG.ALREADY_EXISTS(entity || 'Entity')
}

const parseErrorCode = (errorCode, entity) => {
  switch (errorCode) {
    case ERROR_CODE.ALREADY_CREATED:
      return ERROR_MSG.ALREADY_EXISTS(entity || 'Entity')
    default:
      return `No idea dude, the code ${errorCode} has not been mapped so far`
  }
}

const parseErrorMsg = errorMsg => {
  switch (errorMsg) {
    case ERROR_MSG.NON_ENCRYPTED_DATA:
      return ERROR_MSG.LOGIN
    default:
      return errorMsg
  }
}
