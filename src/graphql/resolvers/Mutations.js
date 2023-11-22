import { ApolloError } from 'apollo-server-errors'
// DB MODELS
import User from '../../db/models/user.model'
import Pet from '../../db/models/pet.model'
import Event from '../../db/models/event.model'
// FUNCTIONS
import { checkAllowedUpdates, parseError, parseErrorMsg } from '../../functions/parsers'
import { decryptPass } from '../../functions/encrypt'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../constants/errors.json'
import { ALLOWED_CREATE, ALLOWED_UPDATE } from '../../constants/allowedFields.json'

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
  updateUser: async (_, updateArgs, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(updateArgs, ALLOWED_UPDATE.USER)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    try {
      Object.keys(updateArgs).forEach(key => (loggedUser[key] = updateArgs[key]))
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

    if (!checkAllowedUpdates(args, ALLOWED_UPDATE.PASSWORD)) {
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
  },
  createPet: async (_, { petInfo }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(petInfo, ALLOWED_CREATE.PET)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    const petAlreadyCreated = await Pet.findOne({ name: petInfo.name, petType: petInfo.petType })

    if (petAlreadyCreated) {
      throw new ApolloError(
        parseErrorMsg.alreadyExists('Pet', ' with this name and pet type'),
        HTTP_CODES.INTERNAL_ERROR_SERVER
      )
    }

    const { _id } = await User.findOne({ userName: loggedUser.userName })

    try {
      const parsedNewPet = new Pet({
        ...petInfo,
        user: _id
      })

      await parsedNewPet.save()

      return parsedNewPet.toJSON()
    } catch (error) {
      throw new ApolloError(parseError(error, 'Pet'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  updatePet: async (_, { petInfo }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(petInfo, ALLOWED_UPDATE.PET)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    const petAlreadyCreated = await Pet.findOne({ name: petInfo.name, petType: petInfo.petType })

    if (petAlreadyCreated) {
      throw new ApolloError(
        parseErrorMsg.alreadyExists('Pet', ' with this name and pet type'),
        HTTP_CODES.INTERNAL_ERROR_SERVER
      )
    }

    try {
      const { id, ...updateInfo } = petInfo
      return (await Pet.findOneAndUpdate({ _id: id }, { ...updateInfo })) && true
    } catch (error) {
      throw new ApolloError(parseError(error, 'Pet'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  createEvent: async (_, { eventInfo }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(eventInfo, ALLOWED_CREATE.EVENT)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    try {
      const parsedNewEvent = new Event(eventInfo)
      await parsedNewEvent.save()
      await Pet.findOneAndUpdate(
        { _id: eventInfo.associatedPets[0] },
        { events: [parsedNewEvent._id] }
      )

      return parsedNewEvent.toJSON()
    } catch (error) {
      throw new ApolloError(parseError(error, 'Event'), HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  }
}

export default Mutations
