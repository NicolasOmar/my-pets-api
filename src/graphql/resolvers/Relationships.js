// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import PetType from '../../db/models/petType.model'
import Color from '../../db/models/color.model'

const Relationships = {
  User: {
    pets: async ({ userName }) => {
      const { _id } = await User.findOne({ userName })
      return (await Pet.find({ user: _id })) || []
    }
  },
  Pet: {
    user: async ({ user }) => await User.findById(user),
    petType: async ({ petType }) => await PetType.findById(petType),
    hairColors: async ({ hairColors }) => await Color.findById(hairColors),
    eyeColors: async ({ eyeColors }) => await Color.findById(eyeColors)
  }
}

export default Relationships
