import cryptoJs from 'crypto-js'
import { ERROR_MSG } from '../constants/errors'

export const sendErrorMsg = errorMessage => {
  return { message: errorMessage }
}

export const decryptPass = pass => {
  return pass
    ? cryptoJs[process.env.CRYPT_METH]
        .decrypt(pass, process.env.CRYPT_SECRET)
        .toString(cryptoJs.enc.Utf8)
    : null
}

export const handleErrorMessages = (error, entity) => {
  return error.errors
    ? Object.keys(error.errors)
        .map(key => error.errors[key].message)
        .join(', ')
    : ERROR_MSG.ALREADY_EXISTS(entity)
}
