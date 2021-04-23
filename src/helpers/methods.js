const cryptoJs = require('crypto-js')

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

module.exports = {
  sendErrorMsg,
  decryptPass
}
