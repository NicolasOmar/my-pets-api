import { GraphQLError } from 'graphql'
// MODELS
import Color from '@models/color.model'
import PetType from '@models/petType.model'
import Pet from '@models/pet.model'
import User from '@models/user.model'
import Event from '@models/event.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '@constants/errors'
// INTERFACES
import { UserAndToken, UserCreateResponse } from '@interfaces/user'
import { PetDocument, PetGetPayload } from '@interfaces/pet'
import {
  QuantityObject,
  TypedQuery,
  EntityObject,
  TypedSimpleQuery,
  EntityDocument
} from '@interfaces/shared'
import { EventDocument, EventGetPayload } from '@interfaces/event'
// FUNCTIONS
import { findByIds, parseUniqueArray } from '@functions/parsers'

interface QueriesInterface {
  getUser: TypedQuery<null, UserAndToken, UserCreateResponse>
  getPetTypes: TypedSimpleQuery<EntityDocument[]>
  getColors: TypedSimpleQuery<EntityDocument[]>
  getMyPets: TypedQuery<string | undefined, UserAndToken, PetDocument[]>
  getPet: TypedQuery<PetGetPayload, UserAndToken, PetDocument>
  getMyPetsPopulation: TypedQuery<null, UserAndToken, QuantityObject[]>
  getMyPetEvents: TypedQuery<EventGetPayload, UserAndToken, EventDocument[]>
}

const Queries: QueriesInterface = {
  getUser: async (_, __, context) => {
    const { loggedUser, token } = context as UserAndToken
    return {
      name: loggedUser.name,
      lastName: loggedUser.lastName,
      userName: loggedUser.userName,
      email: loggedUser.email,
      token: token as string
    }
  },
  getPetTypes: async () => await PetType.find(),
  getColors: async () => await Color.find(),
  getMyPets: async (_, search, context) => {
    if (!context?.loggedUser) {
      throw new GraphQLError(ERROR_MSGS.MISSING_USER_DATA, {
        extensions: { code: HTTP_CODES.UNAUTHORIZED }
      })
    } else {
      const userResponse = await User.findOne({ userName: context.loggedUser.userName })
      const petFindQuery =
        search && search !== ''
          ? { user: userResponse?._id, name: new RegExp(search as string) }
          : { user: userResponse?._id }

      return await Pet.find(petFindQuery)
    }
  },
  getPet: async (_, { petId }, context) => {
    if (!context?.loggedUser) {
      throw new GraphQLError(ERROR_MSGS.MISSING_USER_DATA, {
        extensions: { code: HTTP_CODES.UNAUTHORIZED }
      })
    }

    if (petId === '') {
      throw new GraphQLError(ERROR_MSGS.MISSING_PET_DATA, {
        extensions: { code: HTTP_CODES.NOT_FOUND }
      })
    }

    const foundedPet = await Pet.findOne({ _id: petId })

    if (!foundedPet) {
      throw new GraphQLError(ERROR_MSGS.MISSING_PET_DATA, {
        extensions: { code: HTTP_CODES.NOT_FOUND }
      })
    }

    return foundedPet as PetDocument
  },
  getMyPetsPopulation: async (_, __, context) => {
    if (!context?.loggedUser) {
      throw new GraphQLError(ERROR_MSGS.MISSING_USER_DATA, {
        extensions: { code: HTTP_CODES.UNAUTHORIZED }
      })
    } else {
      const foundedUser = await User.findOne({ userName: context.loggedUser.userName })
      const petPopulation = await Pet.find({ user: foundedUser?._id })

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
      throw new GraphQLError(ERROR_MSGS.MISSING_USER_DATA, {
        extensions: { code: HTTP_CODES.UNAUTHORIZED }
      })
    }

    if (petId === '') {
      throw new GraphQLError(ERROR_MSGS.MISSING_PET_DATA, {
        extensions: { code: HTTP_CODES.NOT_FOUND }
      })
    }

    return await Event.find({ associatedPets: petId })
  }
}

export default Queries
