const cryptoJs = require('crypto-js')
const User = require('../../src/models/user.model')

const encryptPass = (pass) => cryptoJs[process.env.CRYPT_METH].encrypt(pass, process.env.CRYPT_SECRET).toString()

const goodMock = {
  name: 'Virgie',
  lastName: 'Greer',
  email: 'virgie@gmail.com',
  password: encryptPass('testingNames')
}

const badMocks = {
  shortName: {
    ...goodMock,
    name: 'V'
  },
  shortLastName: {
    ...goodMock,
    lastName: 'G'
  },
  shortPass: {
    ...goodMock,
    password: encryptPass('t')
  },
  badMail: {
    ...goodMock,
    email: 'virgie.gmail.net',
  },
  badPass: {
    ...goodMock,
    password: encryptPass('testingErrors')
  }
}

const updateMock = {
  name: 'Updated Name',
  lastName: 'Updated LastName',
  email: 'test@testt.com'
}

const requiredProps = ['name', 'lastName', 'email', 'password']
const requiredNames = ['Name', 'Last Name', 'Email', 'Password']

const failedMock = (user, property) => {
  const obj = { ...user }
  delete obj[property]
  return obj
}

const setUpDatabase = async () => {
  await User.deleteMany()
}

module.exports = {
  goodMock,
  badMocks,
  updateMock,
  requiredProps,
  requiredNames,
  failedMock,
  setUpDatabase
}