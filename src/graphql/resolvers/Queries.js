import { ApolloError } from 'apollo-server-errors'
// MODELS
import Color from '../../db/models/color.model'
import PetType from '../../db/models/petType.model'
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import Event from '../../db/models/event.model'
// CONSTANTS
import { ERROR_MSGS, HTTP_CODES } from '../../constants/errors.json'
// FUNCTIONS
import { findByIds, parseUniqueArray } from '../../functions/parsers'

const Queries = {
  getUser: async (_, __, { loggedUser, token }) => ({
    name: loggedUser.name,
    lastName: loggedUser.lastName,
    email: loggedUser.email,
    token
  }),
  getPetTypes: async () => (await PetType.find()).map(({ _id, name }) => ({ id: _id, name })),
  getColors: async () => (await Color.find()).map(({ _id, name }) => ({ id: _id, name })),
  getMyPets: async (_, query, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const { _id } = await User.findOne({ userName: loggedUser.userName })
    const petFindQuery =
      query?.search && query?.search !== ''
        ? { user: _id, name: new RegExp(query?.search) }
        : { user: _id }

    return await Pet.find(petFindQuery)
  },
  getPet: async (_, { id }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const foundedPet = await Pet.findOne({ _id: id })

    if (!foundedPet) {
      throw new ApolloError(ERROR_MSGS.MISSING_PET_DATA, HTTP_CODES.NOT_FOUND)
    }

    return foundedPet
  },
  getMyPetsPopulation: async (_, __, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const { _id } = await User.findOne({ userName: loggedUser.userName })
    const petPopulation = await Pet.find({ user: _id })

    if (petPopulation.length === 0) {
      return [{ name: 'All', quantity: 0 }]
    }

    const petTypeInfo = Promise.allSettled(
      petPopulation.map(
        pet =>
          new Promise(resolve =>
            resolve(findByIds({ model: PetType, ids: pet.petType, parseId: true }))
          )
      )
    )
    const petTypeList = (await petTypeInfo).map(data => data.value[0].name)
    const parsedPetTypeList = parseUniqueArray(petTypeList, info => ({
      name: info,
      quantity: petTypeList.filter(_info => _info === info).length
    }))

    return [{ name: 'All', quantity: petPopulation.length }, ...parsedPetTypeList]
  },
  getMyPetEvents: async (_, { petId }, { loggedUser }) => {
    if (!loggedUser) {
      throw new ApolloError(ERROR_MSGS.MISSING_USER_DATA, HTTP_CODES.UNAUTHORIZED)
    }

    const { events } = await Pet.findById(petId, 'events')

    const eventsInfo = Promise.allSettled(
      events.map(eventId => new Promise(resolve => resolve(Event.findById(eventId))))
    )

    return (await eventsInfo).map(({ value }) => value)
  }
}

export default Queries
