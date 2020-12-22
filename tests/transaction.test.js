const request = require('supertest')
const app = require('../src/app')
const mongoose = require('../src/db/mongoose')
const {
  testUser,
  mocks,
  setUpDataBase,
  failedMock
} = require('./mocks/transaction.mocks')
// ERRORS
const { ERROR_MSG } = require('../config/errors')

let userToken = null

beforeAll(async () => {
  const { body } = await request(app).post('/users').send(testUser)
  userToken = body.token
})

beforeEach(async () => await setUpDataBase())

afterAll(() => mongoose.disconnect())

describe('TRANSACTIONS', () => {
  describe('HAPPY PATH', () => {
    test('Create a new one', async () => {
      await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mocks[0])
        .expect(201)
    })
  })

  describe('SAD PATH', () => {
    test('Create a new one with certain required fields empty', async () => {
      const mockFail = failedMock(mocks[0], 'title')
      const response =
        await request(app)
          .post('/transactions')
          .set('Authorization', `Bearer ${userToken}`)
          .send(mockFail)
          .expect(400)
      
      expect(response.badRequest).toBeTruthy()
      expect(response.body.errors.title.kind).toBe('required')
      expect(response.body.errors.title.message).toBe(ERROR_MSG.MISSING('Title'))
    })
  })
})