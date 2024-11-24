import { Document } from 'mongoose'
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
import { SelectableDataDocument } from '@interfaces/documents'
import { Quantity, TypedQuery, SecondaryData, QueryParams } from '@interfaces/other'
// FUNCTIONS
import { findByIds, parseUniqueArray } from '@functions/parsers'

interface QueriesInterface {
  getUser: TypedQuery<QueryParams, UserAndToken, LoggedUser>
  getPetTypes: TypedQuery<QueryParams, UserAndToken, SecondaryData[]>
  getColors: TypedQuery<QueryParams, UserAndToken, SecondaryData[]>
  getMyPets: TypedQuery<QueryParams, UserAndToken, PetDocument[]>
  getPet: TypedQuery<QueryParams, UserAndToken, PetDocument>
  getMyPetsPopulation: TypedQuery<QueryParams, UserAndToken, Quantity[]>
  getMyPetEvents: TypedQuery<QueryParams, UserAndToken, typeof Event[]>
}

const Queries: QueriesInterface = {
  getUser: async (_, __, { loggedUser, token }) => ({
    name: loggedUser.name,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    token
  }),
  getPetTypes: async () => (await PetType.find()).map(
    ({ _id, name }: SelectableDataDocument) => ({
      id: _id as string,
      name: name as string
    })
  ),
  getColors: async () => (await Color.find()).map(
    ({ _id, name }: SelectableDataDocument) => ({
      id: _id as string,
      name: name as string
    })
  ),
  getMyPets: async (_, query, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    const userResponse = await User.findOne({ userName: loggedUser.userName })
    const petFindQuery =
      query?.search && query?.search !== ''
        ? { user: userResponse?._id, name: new RegExp(query?.search as string) }
        : { user: userResponse?._id }

    return await Pet.find(petFindQuery)
  },
  getPet: async (_, { id }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    const foundedPet = await Pet.findOne({ _id: id })

    if (!foundedPet) {
      throw new ApolloError(ERROR_MSGS.MISSING_PET_DATA, HTTP_CODES.NOT_FOUND.toString())
    }

    return (foundedPet as PetDocument)
  },
  getMyPetsPopulation: async (_, __, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    const foundedUser = await User.findOne({ userName: loggedUser.userName })
    const petPopulation = await Pet.find({ user: foundedUser?.id })

    if (petPopulation.length === 0) {
      return [{ name: 'All', quantity: 0 }]
    }

    const petTypeInfo = Promise.allSettled(
      petPopulation.map(
        pet =>
          new Promise<SecondaryData | SecondaryData[]>(resolve =>
            resolve(findByIds({ model: PetType, ids: pet.petType }))
          )
      )
    )
    const petTypeList = (await petTypeInfo).filter(({ status }) => status === 'fulfilled').map(_petType => (_petType as PromiseFulfilledResult<SecondaryData>).value)
    const parsedPetTypeList = parseUniqueArray({
      list: petTypeList,
      callback: info => ({
        name: info.name,
        quantity: petTypeList.filter(_info => _info === info).length
      })
    }) as Quantity[]

    return [{ name: 'All', quantity: petPopulation.length }, ...parsedPetTypeList]
  },
  getMyPetEvents: async (_, { petId }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED.toString())
    }

    return await Event.find({ associatedPets: petId })
  }
}

export default Queries
