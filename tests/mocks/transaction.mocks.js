const cryptoJs = require('crypto-js')
const Transaction = require('../../src/models/transaction.model')

const encryptPass = (pass) => cryptoJs[process.env.CRYPT_METH].encrypt(pass, process.env.CRYPT_SECRET).toString()

const mocks = [
  {
    "title": "consequat commodo veniam",
    "amount": 56,
    "date": "Mon Aug 22 2016 05:23:35 GMT+0000 (UTC)"
  },
  {
    "title": "sit occaecat commodo",
    "amount": 53,
    "date": "Sun Jun 08 1975 04:53:32 GMT+0000 (UTC)"
  },
  {
    "title": "aliqua enim in",
    "amount": 70,
    "date": "Thu Aug 20 1970 11:46:14 GMT+0000 (UTC)"
  },
  {
    "title": "nulla proident officia",
    "amount": 54,
    "date": "Sun Sep 14 2008 16:21:21 GMT+0000 (UTC)"
  },
  {
    "title": "irure culpa labore",
    "amount": 45,
    "date": "Thu Nov 09 1978 05:18:12 GMT+0000 (UTC)"
  },
  {
    "title": "eiusmod nostrud id",
    "amount": 62,
    "date": "Mon Jun 13 1983 08:34:38 GMT+0000 (UTC)"
  },
  {
    "title": "sint magna fugiat",
    "amount": 79,
    "date": "Sun Nov 02 1986 15:32:11 GMT+0000 (UTC)"
  },
  {
    "title": "consectetur incididunt aliquip",
    "amount": 35,
    "date": "Wed Nov 07 2007 05:26:50 GMT+0000 (UTC)"
  }
]

const failedMock = (transaction, property) => {
  const obj = { ...transaction }
  delete obj[property]
  return obj
}

const testUser = {
  name: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: encryptPass('myTestPassword')
}

const requiredProps = ['title', 'amount', 'date']
const requiredNames = ['Title', 'Amount', 'Date']

const setUpDataBase = async () => await Transaction.deleteMany()

module.exports = {
  testUser,
  mocks,
  requiredProps,
  requiredNames,
  setUpDataBase,
  failedMock
}