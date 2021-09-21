// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'

const Relationships = {
  User: {
    pets: async ({ userName }) => {
      const { _id } = await User.findOne({ userName })
      return (await Pet.find({ user: _id })) || []
    }
  },
  Pet: {
    user: async ({ user }) => (await User.findById(user)) || []
  }
}

export default Relationships
