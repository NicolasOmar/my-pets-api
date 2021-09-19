// DB MODELS
import Pet from '../../db/models/pet.model'
import User from '../../db/models/user.model'

const Relationships = {
  User: {
    pets: async ({ _id }) => (await Pet.find({ user: _id })) || []
  },
  Pet: {
    user: async ({ userId }) => (await User.findById(userId)) || []
  }
}

export default Relationships
