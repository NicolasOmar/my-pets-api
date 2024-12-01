import { ApolloError } from 'apollo-server-errors'
// MODELS
import Color from '@models/color.model'
import PetType from '@models/petType.model'
import Pet from '@models/pet.model'
import User from '@models/user.model'
import Event from '@models/event.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
// INTERFACES
import { UserAndToken, LoggedUser } from '@interfaces/user'
import { PetDocument } from '@interfaces/pet'
import {
  QuantityObject,
  TypedQuery,
  EntityObject,
  QueryDef,
  TypedSimpleQuery,
  EntityDocument
} from '@interfaces/shared'
// FUNCTIONS
import { findByIds, parseUniqueArray } from '@functions/parsers'
import { EventDocument } from '@interfaces/event'

interface QueriesInterface {
  getUser: TypedQuery<QueryDef, UserAndToken, LoggedUser>
  getPetTypes: TypedSimpleQuery<EntityDocument[]>
  getColors: TypedSimpleQuery<EntityDocument[]>
  getMyPets: TypedQuery<QueryDef, UserAndToken, PetDocument[]>
  getPet: TypedQuery<QueryDef, UserAndToken, PetDocument>
  getMyPetsPopulation: TypedQuery<QueryDef, UserAndToken, QuantityObject[]>
  getMyPetEvents: TypedQuery<QueryDef, UserAndToken, EventDocument[]>
}

const Queries: QueriesInterface = {
  getUser: async (_, __, context) => {
    const { loggedUser, token } = context as UserAndToken
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      token: token as string
    }
  },
  getPetTypes: async () => await PetType.find(),
  getColors: async () => await Color.find(),
  getMyPets: async (_, query, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    } else {
      const userResponse = await User.findOne({ userName: context.loggedUser.userName })
      const petFindQuery =
        query?.search && query?.search !== ''
          ? { user: userResponse?._id, name: new RegExp(query?.search as string) }
          : { user: userResponse?._id }

      return await Pet.find(petFindQuery)
    }
  },
  getPet: async (_, { id }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    const foundedPet = await Pet.findOne({ _id: id })

    if (!foundedPet) {
      throw new ApolloError(ERROR_MSGS.MISSING_PET_DATA, HTTP_CODES.NOT_FOUND.toString())
    }

    return foundedPet as PetDocument
  },
  getMyPetsPopulation: async (_, __, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    } else {
      const foundedUser = await User.findOne({ userName: context.loggedUser.userName })
      const petPopulation = await Pet.find({ user: foundedUser?.id })

      if (petPopulation.length === 0) {
        return [{ name: 'All', quantity: 0 }]
      }

      const petTypeInfo = Promise.allSettled(
        petPopulation.map(
          pet =>
            new Promise<EntityObject | EntityObject[]>(resolve =>
              resolve(findByIds({ model: PetType, ids: pet.petType }))
            )
        )
      )
      const petTypeList = (await petTypeInfo)
        .filter(({ status }) => status === 'fulfilled')
        .map(_petType => (_petType as PromiseFulfilledResult<EntityObject>).value)
      const parsedPetTypeList = parseUniqueArray({
        list: petTypeList,
        callback: info => ({
          name: info.name,
          quantity: petTypeList.filter(_info => _info === info).length
        })
      }) as QuantityObject[]

      return [{ name: 'All', quantity: petPopulation.length }, ...parsedPetTypeList]
    }
  },
  getMyPetEvents: async (_, { petId }, context) => {
    if (!context?.loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    return await Event.find({ associatedPets: petId })
  }
}

export default Queries
