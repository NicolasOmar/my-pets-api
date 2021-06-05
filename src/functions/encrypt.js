import CryptoJs from 'crypto-js'

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
