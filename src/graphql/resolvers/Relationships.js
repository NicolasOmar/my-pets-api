// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'
import PetType from '../../db/models/petType.model'
import Color from '../../db/models/color.model'

const Relationships = {
  User: {
    pets: async ({ userName }) => {
      const user = userName ? (await User.findOne({ userName }))._id : null
      return await Pet.find({ user })
    }
  },
  Pet: {
    user: async ({ user }) => await User.findById(user),
    petType: async ({ petTypes }) =>
      (await PetType.find().where('_id').in(petTypes)).map(({ _id, name }) => ({ id: _id, name })),
    hairColors: async ({ hairColors }) =>
      (await Color.find().where('_id').in(hairColors)).map(({ _id, name }) => ({ id: _id, name })),
    eyeColors: async ({ eyeColors }) =>
      (await Color.find().where('_id').in(eyeColors)).map(({ _id, name }) => ({ id: _id, name }))
  }
}

export default Relationships
