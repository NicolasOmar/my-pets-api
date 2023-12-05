// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import PetType from '../../db/models/petType.model'
import Color from '../../db/models/color.model'
import Event from '../../db/models/event.model'
// CONSTANTS
import { ALLOWED_CREATE } from '../../constants/allowedFields.json'
// FUNCTIONS
import { findByIds } from '../../functions/parsers'

const Relationships = {
  User: {
    pets: async ({ userName }) => {
      const user = userName ? (await User.findOne({ userName }))._id : null
      return await Pet.find({ user })
    }
  },
  Pet: {
    user: async ({ user }) => await User.findById(user),
    petType: async ({ petType }) =>
      await findByIds({
        model: PetType,
        ids: petType,
        findOne: true,
        parseId: true
      }),
    hairColors: async ({ hairColors }) =>
      await findByIds({
        model: Color,
        ids: hairColors,
        parseId: true
      }),
    eyeColors: async ({ eyeColors }) =>
      await findByIds({
        model: Color,
        ids: eyeColors,
        parseId: true
      }),
    events: async ({ events }) =>
      await findByIds({
        model: Event,
        ids: events,
        parser: `_id ${ALLOWED_CREATE.EVENT.join(' ')}`
      })
  },
  Event: {
    associatedPets: async ({ associatedPets }) =>
      await findByIds({
        model: Pet,
        ids: associatedPets,
        parser: `_id ${ALLOWED_CREATE.PET.join(' ')}`
      })
  }
}

export default Relationships
