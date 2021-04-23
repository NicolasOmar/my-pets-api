const { decryptPass } = require('../../helpers/methods')
// ERROR CODES AND ERROR_MSG
const { handleErrorMessages } = require('../../config/errors')

const Mutation = {
  loginUser: async (_, { email, password }, { User }) => {
    try {
      const userLogged = await User.findByCredentials(email, decryptPass(password))
      const token = await userLogged.generateAuthToken()
      return { userLogged, token }
    } catch (error) {
      return error
    }
  },
  createUser: async (_, args, { User }) => {
    const newUser = new User({
      ...args,
      password: decryptPass(args.password)
    })

    try {
      await newUser.save()
      const token = await newUser.generateAuthToken()
      return { ...newUser, token }
    } catch (error) {
      return handleErrorMessages(error, 'User')
    }
  }
  // updateUser: async(_, args, { loggedUser }) => {
  //   const updates = Object.keys(args)
  //   const allowedUpdates = ['name', 'lastName']

  //   const isValidOperation = Object.keys(request.body).every(update =>
  //     allowedUpdates.includes(update)
  //   )

  //   if (!isValidOperation) {
  //     return { message: ERROR_MSG.UPDATES }
  //   }

  //   try {
  //     updates.forEach(update => (loggedUser[update] = request.body[update]))
  //     await loggedUser.save()

  //     if (!loggedUser) {
  //       return response.status(404).send()
  //     }

  //     return loggedUser
  //   } catch (error) {
  //     return handleErrorMessages(error, 'User')
  //   }
  // },
  // logout: async(_, __, { loggedUser }) => {
  //   try {
  //     loggedUser.tokens = loggedUser.tokens.filter(token => token.token !== request.token)
  //     await loggedUser.save()
  //     return true
  //   } catch (error) {
  //     // response.status(500).send(error)
  //     return error
  //   }
  //   // (error, request, response) => {
  //   //   // IN CASE OF A MIDDLEWARE ERROR, THE ROUTER USES A SECOND ARGUMENT TO HANDLE SUCH ERRORS (LIKE A THEN <> CATCH STRUCTURE)
  //   //   response.status(400).send({ error: error.message })
  //   // }
  // },
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

module.exports = Mutation
