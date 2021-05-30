import User from '../../mongo/user.model'
// PARSERS
import { decryptPass, handleErrorMessages } from '../../functions/parsers'
import { ERROR_MSG } from '../../constants/errors'
import { ApolloError } from 'apollo-server-errors'

const Mutation = {
  loginUser: async (_, { email, password }) => {
    try {
      const userLogged = await User.findByCredentials(email, decryptPass(password))
      const token = await userLogged.generateAuthToken()

      return { ...userLogged.toJSON(), token }
    } catch (error) {
      return error
    }
  },
  createUser: async (_, { newUser }) => {
    const parsedNewUser = new User({
      ...newUser,
      password: decryptPass(newUser.password)
    })

    try {
      await parsedNewUser.save()
      const token = await parsedNewUser.generateAuthToken()

      return { ...parsedNewUser.toJSON(), token }
    } catch (error) {
      throw new Error(handleErrorMessages(error, 'User'))
    }
  },
  updateUser: async (_, args, { loggedUser }) => {
    const updates = Object.keys(args)
    const allowedUpdates = ['name', 'lastName']
    const isValidOperation = Object.keys(args).every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
      return { message: ERROR_MSG.UPDATES }
    }

    try {
      updates.forEach(update => (loggedUser[update] = args[update]))
      await loggedUser.save()

      if (loggedUser) {
        return loggedUser.toJSON()
      } else {
        throw new ApolloError('', '404')
      }
    } catch (error) {
      return handleErrorMessages(error, 'User')
    }
  },
  logout: async (_, __, { loggedUser, token }) => {
    try {
      loggedUser.tokens = loggedUser.tokens.filter(_token => _token.token !== token)
      await loggedUser.save()
      return true
    } catch (error) {
      // response.status(500).send(error)
      return error
    }
    // (error, request, response) => {
    //   // IN CASE OF A MIDDLEWARE ERROR, THE ROUTER USES A SECOND ARGUMENT TO HANDLE SUCH ERRORS (LIKE A THEN <> CATCH STRUCTURE)
    //   response.status(400).send({ error: error.message })
    // }
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

export default Mutation
