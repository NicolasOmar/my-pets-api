import { ApolloError } from 'apollo-server-errors'
// MODELS
import User from '../../db/models/user.model'
// FUNCTIONS
import { checkAllowedUpdates, parseError } from '../../functions/parsers'
import { decryptPass } from '../../functions/encrypt'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../constants/errors.json'

const Mutations = {
  loginUser: async (_, { email, password }) => {
    try {
      const userLogged = await User.findByCredentials(email, decryptPass(password))
      const token = await userLogged.generateAuthToken()

      return { ...userLogged.toJSON(), token }
    } catch (error) {
      throw new ApolloError(parseError(error, 'User'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  createUser: async (_, { newUser }) => {
    try {
      const parsedNewUser = new User({
        ...newUser,
        password: decryptPass(newUser.password)
      })

      await parsedNewUser.save()
      const token = await parsedNewUser.generateAuthToken()

      return { ...parsedNewUser.toJSON(), token }
    } catch (error) {
      throw new ApolloError(parseError(error, 'User'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  updateUser: async (_, args, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const allowedUpdates = ['name', 'lastName']
    const isValidOperation = checkAllowedUpdates(args, allowedUpdates)

    if (!isValidOperation) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    try {
      Object.keys(args).forEach(update => (loggedUser[update] = args[update]))
      await loggedUser.save()

      return loggedUser.toJSON()
    } catch (error) {
      throw new ApolloError(parseError(error, 'User'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  updatePass: async (_, args, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const allowedFields = ['oldPass', 'newPass']
    const isValidOperation = checkAllowedUpdates(args, allowedFields)

    if (!isValidOperation) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    if (!args.oldPass) {
      throw new ApolloError(ERROR_MSGS.PASSWORD, HTTP_CODES.NOT_FOUND)
    }

    try {
      await User.findByCredentials(loggedUser.email, decryptPass(args.oldPass))
      loggedUser.password = decryptPass(args.newPass)

      await loggedUser.save()

      return true
    } catch (error) {
      const errorMsg = error.message === ERROR_MSGS.LOGIN ? ERROR_MSGS.PASSWORD : parseError(error)
      throw new ApolloError(errorMsg, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  logout: async (_, __, { loggedUser, token }) => {
    if (!loggedUser || !token) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    try {
      loggedUser.tokens = loggedUser.tokens.filter(_token => _token.token !== token)
      await loggedUser.save()
      return true
    } catch (error) {
      throw new ApolloError(parseError(error, 'User'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  }
  // logoutAll: async(_, __, { loggedUser }) => {
  //   try {
  //     loggedUser.tokens = []
  //     await loggedUser.save()
  //     return true
  //   } catch (error) {
  //     // response.status(500).send(error)
  //     return error
  //   }
  // }
}

export default Mutations
