const request = require('supertest')
const app = require('../src/app')
const mongoose = require('../src/db/mongoose')
const {
  goodMock,
  badMocks,
  updateMock,
  requiredProps,
  requiredNames,
  failedMock,
  setUpDatabase,
} = require('./mocks/users.mocks')
// ERROR CODES AND MESSAGES
const { ERROR_CODE, ERROR_MSG } = require('../config/errors')
// ROUTES
const { USERS_ROUTES } = require('../config/routes')

beforeEach(async () => await setUpDatabase())

afterAll(() => mongoose.disconnect())

describe('USERS', () => {
  describe('HAPPY PATH', () => {
    test('Login a created user', async () => {      
      await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const { body } =
        await request(app)
          .post(USERS_ROUTES.LOGIN)
          .send({ email: goodMock.email, password: goodMock.password})
          .expect(200)

      Object.keys(goodMock).forEach(
        key => key !== 'password' && expect(body.userLogged[key]).toBe(goodMock[key])
      )
    })

    test('Sign up a new user and check registred properties', async () => {
      const { body } = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      Object.keys(goodMock).forEach(
        key => key !== 'password' && expect(body.newUser[key]).toBe(goodMock[key])
      )
      expect(body.token).not.toBeNull()
    })
    
    test('Update data of a created user', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const updatedObj =
        await request(app)
          .patch(USERS_ROUTES.ME)
          .set('Authorization', `Bearer ${response.body.token}`)
          .send(updateMock)
          .expect(200)
      
      Object.keys(updateMock).forEach(
        prop => {
          expect(updatedObj.body[prop]).toBe(updateMock[prop])
        }
      )
    })

    test('Delete a created user', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const { body } =
        await request(app)
          .delete(USERS_ROUTES.ME)
          .set('Authorization', `Bearer ${response.body.token}`)
          .send()
          .expect(200)
      
      Object.keys(body).forEach(
        key => key !== 'password' && expect(body[key]).toBe(goodMock[key])
      )
    })

    test('Log out a created user', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const logOutResponse =
        await request(app)
          .post(USERS_ROUTES.LOGOUT)
          .set('Authorization', `Bearer ${response.body.token}`)
          .expect(200)

      expect(logOutResponse).toBeTruthy();
    })

    test('Log out a created user from all sessions', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const logOutResponse =
        await request(app)
          .post(USERS_ROUTES.LOGOUT_ALL)
          .set('Authorization', `Bearer ${response.body.token}`)
          .expect(200)

      expect(logOutResponse).toBeTruthy();
    })
  })

  describe('SAD PATH', () => {
    test('Login a not created user', async () => {
      const response = await request(app).post(USERS_ROUTES.LOGIN).send(goodMock).expect(400)
      expect(response.body.message).toBe(ERROR_MSG.LOGIN)
    })

    test('Login a user with bad properties', async () => {
      await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)

      const mailResposne = await request(app).post(USERS_ROUTES.LOGIN).send(badMocks.badMail).expect(400)
      expect(mailResposne.badRequest).toBeTruthy()
      expect(mailResposne.body.message).toBe(ERROR_MSG.LOGIN)

      const passResponse = await request(app).post(USERS_ROUTES.LOGIN).send(badMocks.badPass).expect(400)
      expect(passResponse.badRequest).toBeTruthy()
      expect(passResponse.body.message).toBe(ERROR_MSG.LOGIN)
    })

    test('Login a deleted user', async () => {
      const { body } = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)

      await request(app)
        .delete(USERS_ROUTES.ME)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200)

      const response = await request(app)
        .post(USERS_ROUTES.LOGIN)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(400)
      
      expect(response.body.message).toBe(ERROR_MSG.LOGIN)
    })

    test('Sign up a new user with certain required fields empty', async () => {
      requiredProps.forEach(
        async (prop, i) => {
          const mockFail = failedMock(goodMock, prop)
          const response = await request(app).post(USERS_ROUTES.MAIN).send(mockFail).expect(400)
          
          expect(response.badRequest).toBeTruthy()
          expect(response.body.errors[prop].kind).toBe('required')
          expect(response.body.errors[prop].message).toBe(ERROR_MSG.MISSING(requiredNames[i]))
        }
      )
    })

    test('Sign up a new user with an invalid email (user validation)', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(badMocks.badMail).expect(400)
      
      expect(response.badRequest).toBeTruthy()
      expect(response.body.errors.email.kind).toBe('user defined')
      expect(response.body.errors.email.message).toBe(ERROR_MSG.EMAIL)
    })

    test('Sign up a new user with an invalid name (minlength validation)', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(badMocks.shortName).expect(400)
      
      expect(response.badRequest).toBeTruthy()
      expect(response.body.errors.name.kind).toBe('minlength')
      expect(response.body.errors.name.message).toBe(ERROR_MSG.MIN('Name', 3))
    })

    test('Sign up a new user with an invalid last name (minlength validation)', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(badMocks.shortLastName).expect(400)
      
      expect(response.badRequest).toBeTruthy()
      expect(response.body.errors.lastName.kind).toBe('minlength')
      expect(response.body.errors.lastName.message).toBe(ERROR_MSG.MIN('Last Name', 3))
    })

    test('Sign up a new user with an invalid password (minlength validation)', async () => {
      const response = await request(app).post(USERS_ROUTES.MAIN).send(badMocks.shortPass).expect(400)
      
      expect(response.badRequest).toBeTruthy()
      expect(response.body.errors.password.kind).toBe('minlength')
      expect(response.body.errors.password.message).toBe(ERROR_MSG.MIN('Password', 6))
    })
    
    test('Sign up twice the same user', async () => {
      await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(400)

      expect(response.badRequest).toBeTruthy()
      expect(response.body.driver).toBeTruthy()
      expect(response.body.code).toBe(ERROR_CODE.ALREADY_EXISTS)
    })

    test('Update a created user with invalid properties', async () => {
      const failedUpdate = { age: 15 }

      const response = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)
      const updated =
        await request(app)
          .patch(USERS_ROUTES.ME)
          .set('Authorization', `Bearer ${response.body.token}`)
          .send(failedUpdate)
          .expect(403)
      
      expect(updated.body.error).toBe(ERROR_MSG.UPDATES)
    })

    test('Log out a deleted user', async () => {
      const { body } = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)

      await request(app)
        .delete(USERS_ROUTES.ME)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200)

      const response = await request(app)
        .post(USERS_ROUTES.LOGOUT)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(401)
        
      expect(response.body.message).toBe(ERROR_MSG.AUTHENTICATE)
    })

    test('Log out a deleted user from all sessions', async () => {
      const { body } = await request(app).post(USERS_ROUTES.MAIN).send(goodMock).expect(201)

      await request(app)
        .delete(USERS_ROUTES.ME)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200)

      const response = await request(app)
        .post(USERS_ROUTES.LOGOUT_ALL)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(401)
        
      expect(response.body.message).toBe(ERROR_MSG.AUTHENTICATE)
    })
  })
})