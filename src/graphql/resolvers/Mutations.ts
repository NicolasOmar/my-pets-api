import mongoose, { Error } from 'mongoose'
import { ApolloError } from 'apollo-server-errors'
// DB MODELS
import User from '@models/user.model'
import Pet from '@models/pet.model'
import Event from '@models/event.model'
// FUNCTIONS
import { checkAllowedUpdates, parseErrorMsg } from '@functions/parsers'
import { decryptPass } from '@functions/encrypt'
// INTERFACES
import {
  LoggedUser,
  UserAndToken,
  UserDocument,
  UserCreatePayload,
  UserLoginPayload,
  UserPassChangePayload,
  UserUpdatePayload,
  UserCreateResponse,
  UserObject
} from '@interfaces/user'
import { PetDocument, PetCreatePayload, PetUpdatePayload } from '@interfaces/pet'
import { EventCreatePayload, EventDocument } from '@interfaces/event'
import { TypedMutation } from '@interfaces/shared'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
import { ALLOWED_CREATE, ALLOWED_UPDATE } from '@constants/allowedFields.json'

interface MutationsInterface {
  loginUser: TypedMutation<UserLoginPayload, LoggedUser, UserAndToken>
  createUser: TypedMutation<UserCreatePayload, LoggedUser, UserCreateResponse>
  updateUser: TypedMutation<UserUpdatePayload, UserAndToken, UserDocument>
  updatePass: TypedMutation<UserPassChangePayload, UserAndToken, boolean>
  logout: TypedMutation<null, UserAndToken, boolean>
  createPet: TypedMutation<PetCreatePayload, UserAndToken, PetDocument>
  updatePet: TypedMutation<PetUpdatePayload, UserAndToken, boolean>
  createEvent: TypedMutation<EventCreatePayload, UserAndToken, EventDocument>
}

const Mutations: MutationsInterface = {
  loginUser: async (_, { payload }) => {
    try {
      const decryptedPass = decryptPass(payload.password)
      const userLogged = await User.findByCredentials(payload.email, decryptedPass)
      const token = await userLogged.generateAuthToken()
      
      return { loggedUser: userLogged.toJSON() as LoggedUser, token }
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  createUser: async (_, { payload }) => {
    try {
      const parsedNewUser = new User({
        ...payload,
        password: decryptPass(payload.password as string)
      })

      await parsedNewUser.save()
      const token = await parsedNewUser.generateAuthToken()

      return {
        name: parsedNewUser.name,
        userName: parsedNewUser.userName,
        lastName: parsedNewUser.lastName,
        email: parsedNewUser.email,
        token
      }
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  updateUser: async (_, { payload }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      try {
        const updatedUser = {
          ...context.loggedUser,
          name: payload.name,
          lastName: payload.lastName
        }

        const updateResponse = await (updatedUser as UserDocument).save()

        return updateResponse
      } catch (error) {
        throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  },
  updatePass: async (_, { payload }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      if (!checkAllowedUpdates(payload, ALLOWED_UPDATE.PASSWORD)) {
        throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
      }

      if (!payload.oldPass) {
        throw new ApolloError(ERROR_MSGS.PASSWORD, HTTP_CODES.NOT_FOUND)
      }

      try {
        const userWitCredentials = await User.findByCredentials(
          context.loggedUser.email,
          decryptPass(payload.oldPass)
        )
        userWitCredentials.password = decryptPass(payload.newPass)

        await userWitCredentials.save()

        return true
      } catch (error) {
        const parsedError = error as Error
        const errorMsg =
          parsedError.message === ERROR_MSGS.LOGIN ? ERROR_MSGS.PASSWORD : parsedError.message
        throw new ApolloError(errorMsg, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  },
  logout: async (_, __, context) => {
    if (!context?.loggedUser || !context?.token) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      try {
        const userWitCredentials = (await User.find({ email: context.loggedUser.email }))[0]
        userWitCredentials.tokens = userWitCredentials.tokens.filter(
          _token => _token.token !== context.token
        )
        await userWitCredentials.save()
        return true
      } catch (error) {
        throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  },
  createPet: async (_, { payload }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      if (!checkAllowedUpdates(payload, ALLOWED_CREATE.PET)) {
        throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
      }

      const petAlreadyCreated = await Pet.findOne({
        name: payload.name,
        petType: payload.petType
      })

      if (petAlreadyCreated) {
        throw new ApolloError(
          parseErrorMsg.alreadyExists('Pet', ' with this name and pet type'),
          HTTP_CODES.INTERNAL_ERROR_SERVER
        )
      }

      const findedUser = await User.findOne({ userName: context.loggedUser.userName })

      try {
        const parsedNewPet = new Pet({
          ...payload,
          user: findedUser?._id
        })

        await parsedNewPet.save()

        return parsedNewPet.toJSON()
      } catch (error) {
        throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  },
  updatePet: async (_, { id, payload }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      if (!checkAllowedUpdates(payload, ALLOWED_UPDATE.PET)) {
        throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
      }

      const petAlreadyCreated = await Pet.findOne({
        name: payload.name,
        petType: payload.petType
      })

      if (petAlreadyCreated) {
        throw new ApolloError(
          parseErrorMsg.alreadyExists('Pet', ' with this name and pet type'),
          HTTP_CODES.INTERNAL_ERROR_SERVER
        )
      }

      try {
        const response = await Pet.findOneAndUpdate({ _id: id }, { ...payload })
        return response ? true : false
      } catch (error) {
        throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  },
  createEvent: async (_, { eventPayload }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    } else {
      if (!checkAllowedUpdates(eventPayload, ALLOWED_CREATE.EVENT)) {
        throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
      }

      try {
        const parsedNewEvent = new Event(eventPayload)
        await parsedNewEvent.save()
        const findedPet = await Pet.findById(eventPayload.associatedPets[0])
        await Pet.findOneAndUpdate(
          { _id: eventPayload.associatedPets[0] },
          { events: [...(findedPet?.events ?? []), parsedNewEvent._id] }
        )

        return parsedNewEvent.toJSON()
      } catch (error) {
        throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
      }
    }
  }
}

export default Mutations
