import cryptoJs from 'crypto-js'

enum CryptoMethods {
  AES = 'AES',
  DES = 'DES',
  TripleDES = 'TripleDES',
  RC4 = 'RC4',
  RC4Drop = 'RC4Drop',
  Rabbit = 'Rabbit',
  RabbitLegacy = 'RabbitLegacy',
  Blowfish = 'Blowfish'
}

const encryptParser: (
  method: CryptoMethods,
  pass: string,
  cryptSecret: string,
  isEncrypting?: boolean
) => string = (method, pass, cryptSecret, isEncrypting = true) => {
  switch (method) {
    case CryptoMethods.AES:
      return isEncrypting
        ? cryptoJs.AES.encrypt(pass, cryptSecret).toString()
        : cryptoJs.AES.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.DES:
      return isEncrypting
        ? cryptoJs.DES.encrypt(pass, cryptSecret).toString()
        : cryptoJs.DES.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.TripleDES:
      return isEncrypting
        ? cryptoJs.TripleDES.encrypt(pass, cryptSecret).toString()
        : cryptoJs.TripleDES.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.RC4:
      return isEncrypting
        ? cryptoJs.RC4.encrypt(pass, cryptSecret).toString()
        : cryptoJs.RC4.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.RC4Drop:
      return isEncrypting
        ? cryptoJs.RC4Drop.encrypt(pass, cryptSecret).toString()
        : cryptoJs.RC4Drop.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.Rabbit:
      return isEncrypting
        ? cryptoJs.Rabbit.encrypt(pass, cryptSecret).toString()
        : cryptoJs.Rabbit.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.RabbitLegacy:
      return isEncrypting
        ? cryptoJs.RabbitLegacy.encrypt(pass, cryptSecret).toString()
        : cryptoJs.RabbitLegacy.decrypt(pass, cryptSecret).toString()
    case CryptoMethods.Blowfish:
      return isEncrypting
        ? cryptoJs.Blowfish.encrypt(pass, cryptSecret).toString()
        : cryptoJs.Blowfish.decrypt(pass, cryptSecret).toString()
  }
}

export const encryptPass = (pass: string | null) => {
  return encryptParser(
    process.env.CRYPT_METH as CryptoMethods,
    pass ?? '',
    process.env.CRYPT_SECRET as string
  )
}

export const decryptPass = (pass: string | null) => {
  return encryptParser(
    process.env.CRYPT_METH as CryptoMethods,
    pass ?? '',
    process.env.CRYPT_SECRET as string,
    false
  )
}
