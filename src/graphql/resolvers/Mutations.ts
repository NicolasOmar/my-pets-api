import mongoose, { Error } from 'mongoose'
import { ApolloError } from 'apollo-server-errors'
// DB MODELS
import UserEntity from '@models/user.model'
import PetEntity from '@models/pet.model'
import EventEntity from '@models/event.model'
// FUNCTIONS
import { checkAllowedUpdates, parseErrorMsg } from '@functions/parsers'
import { decryptPass } from '@functions/encrypt'
// INTERFACES
import { BaseUser, LoggedUser, UserAndToken, UserDocument } from '@interfaces/user'
import { PetDocument } from '@interfaces/pet'
import { EventDocument } from '@interfaces/event'
import { TypedMutation } from '@interfaces/other'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
import { ALLOWED_CREATE, ALLOWED_UPDATE } from '@constants/allowedFields.json'

interface MutationsInterface {
  loginUser: TypedMutation<{ email: string, password: string}, LoggedUser, UserAndToken>
  createUser: TypedMutation<{ newUser: BaseUser }, LoggedUser, UserAndToken>
  updateUser: TypedMutation<UserDocument, UserAndToken, UserDocument>
  updatePass: TypedMutation<{ oldPass: string, newPass: string}, UserAndToken, boolean>
  logout: TypedMutation<null, UserAndToken, boolean>
  createPet: TypedMutation<{ petInfo: PetDocument }, UserAndToken, PetDocument>
  updatePet: TypedMutation<{ petInfo: PetDocument }, UserAndToken, boolean>
  createEvent: TypedMutation<{ eventInfo: EventDocument}, UserAndToken, EventDocument>
}

const Mutations: MutationsInterface = {
  loginUser: async (_, { email, password }) => {
    try {
      const userLogged = await UserEntity.findByCredentials(email, decryptPass(password))
      const token = await userLogged.generateAuthToken()

      return { loggedUser: userLogged.toJSON() as UserDocument, token }
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  createUser: async (_, { newUser }) => {
    try {
      const parsedNewUser = new UserEntity({
        ...newUser,
        password: decryptPass(newUser.password as string)
      })

      await parsedNewUser.save()
      const token = await parsedNewUser.generateAuthToken()

      return { loggedUser: parsedNewUser.toJSON() as UserDocument, token }
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
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
      const updatedDocument = Object.keys(loggedUser).reduce(
        (_totalObj, key) => {
          const findedKey = updateArgs[key as keyof UserDocument] !== undefined

          if (findedKey) {
            return {
              ..._totalObj,
              key: updateArgs[key as keyof UserDocument]
            }
          } else {
            return _totalObj
          }
        }, {}
      )
      
      await (updatedDocument as UserDocument).save()

      return loggedUser.toJSON() as UserDocument
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
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
      await UserEntity.findByCredentials(loggedUser.email, decryptPass(args.oldPass))
      loggedUser.password = decryptPass(args.newPass)

      await loggedUser.save()

      return true
    } catch (error) {
      const parsedError = error as Error
      const errorMsg = parsedError.message === ERROR_MSGS.LOGIN ? ERROR_MSGS.PASSWORD : parsedError.message
      throw new ApolloError(errorMsg, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  logout: async (_, __, { loggedUser, token }) => {
    if (!loggedUser || !token) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    try {
      loggedUser.tokens = (loggedUser.tokens ?? []).filter(_token => _token.token !== token)
      await loggedUser.save()
      return true
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  createPet: async (_, { petInfo }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(petInfo, ALLOWED_CREATE.PET)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    const petAlreadyCreated = await PetEntity.findOne({ name: petInfo.name, petType: petInfo.petType })

    if (petAlreadyCreated) {
      throw new ApolloError(
        parseErrorMsg.alreadyExists('PetEntity', ' with this name and pet type'),
        HTTP_CODES.INTERNAL_ERROR_SERVER
      )
    }

    const findedUser = await UserEntity.findOne({ userName: loggedUser.userName })

    try {
      const parsedNewPet = new PetEntity({
        ...petInfo,
        user: findedUser?._id
      })

      await parsedNewPet.save()

      return parsedNewPet.toJSON()
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  },
  updatePet: async (_, { petInfo }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    if (!checkAllowedUpdates(petInfo, ALLOWED_UPDATE.PET)) {
      throw new ApolloError(ERROR_MSGS.UPDATES, HTTP_CODES.UNPROCESSABLE_ENTITY)
    }

    const petAlreadyCreated = await PetEntity.findOne({ name: petInfo.name, petType: petInfo.petType })

    if (petAlreadyCreated) {
      throw new ApolloError(
        parseErrorMsg.alreadyExists('PetEntity', ' with this name and pet type'),
        HTTP_CODES.INTERNAL_ERROR_SERVER
      )
    }

    try {
      const { id, ...updateInfo } = petInfo
      const response = await PetEntity.findOneAndUpdate({ _id: id }, { ...updateInfo })
      return response ? true : false
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
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
      const parsedNewEvent = new EventEntity(eventInfo)
      await parsedNewEvent.save()
      const findedPet = await PetEntity.findById(eventInfo.associatedPets[0])
      await PetEntity.findOneAndUpdate(
        { _id: eventInfo.associatedPets[0] },
        { events: [...(findedPet?.events ?? []), parsedNewEvent._id] }
      )

      return parsedNewEvent.toJSON()
    } catch (error) {
      throw new ApolloError((error as mongoose.Error).message, HTTP_CODES.INTERNAL_ERROR_SERVER)
    }
  }
}

export default Mutations
