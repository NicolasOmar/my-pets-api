import CryptoJs from 'crypto-js'
import { ERROR_MSG } from '../constants/errors'

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
  return error.errors
    ? Object.keys(error.errors)
        .map(key => error.errors[key].message)
        .join(', ')
    : ERROR_MSG.ALREADY_EXISTS(entity)
}
