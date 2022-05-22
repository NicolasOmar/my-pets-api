// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import PetType from '../../db/models/petType.model'
import Color from '../../db/models/color.model'
import { findIds } from '../../functions/parsers'

const Relationships = {
  User: {
    pets: async ({ userName }) => {
      const user = userName ? (await User.findOne({ userName }))._id : null
      return await Pet.find({ user })
    }
  },
  Pet: {
    user: async ({ user }) => await User.findById(user),
    petType: async ({ petTypes }) => await findIds(PetType, petTypes),
    hairColors: async ({ hairColors }) => await findIds(Color, hairColors),
    eyeColors: async ({ eyeColors }) => await findIds(Color, eyeColors)
  }
}

export default Relationships
