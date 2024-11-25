// DB MODELS
import Pet from '@models/pet.model'
import User from '@models/user.model'
import PetType from '@models/petType.model'
import Color from '@models/color.model'
import Event from '@models/event.model'
// CONSTANTS
import { ALLOWED_CREATE } from '@constants/allowedFields.json'
// FUNCTIONS
import { findByIds } from '@functions/parsers'
import { SecondaryData, TypedRelationship } from '@interfaces/other'
import { PetDocument } from '@interfaces/pet'
import { UserDocument } from '@interfaces/user'
import { EventDocument } from '@interfaces/event'

interface RelationshipsInterface {
  User: {
    pets: TypedRelationship<{ userName: string }, PetDocument[]>
  }
  Pet: {
    user: TypedRelationship<{ user: string }, UserDocument | null>
    petType: TypedRelationship<{ petType: string }, SecondaryData | SecondaryData[]>
    hairColors: TypedRelationship<{ hairColors: string }, SecondaryData | SecondaryData[]>
    eyeColors: TypedRelationship<{ eyeColors: string }, SecondaryData | SecondaryData[]>
    // events: TypedRelationship<{ events: string[] }, SecondaryData | SecondaryData[]>
  }
  // Event: {
  //   associatedPets: TypedRelationship<{ associatedPets: string[] }, PetDocument | PetDocument[]>
  // }
}

const Relationships: RelationshipsInterface = {
  User: {
    pets: async ({ userName }) => {
      const user = userName ? (await User.findOne({ userName }))?._id : null
      return await Pet.find({ user })
    }
  },
  Pet: {
    user: async ({ user }) => await User.findById(user),
    petType: async ({ petType }) =>
      await findByIds({
        model: PetType,
        ids: petType
      }),
    hairColors: async ({ hairColors }) =>
      await findByIds({
        model: Color,
        ids: hairColors
      }),
    eyeColors: async ({ eyeColors }) =>
      await findByIds({
        model: Color,
        ids: eyeColors
      })
    // events: async ({ events }) =>
    //   await findByIds({
    //     model: Event,
    //     ids: events,
    //     parser: `_id ${ALLOWED_CREATE.EVENT.join(' ')}`
    //   })
  }
  // Event: {
  //   associatedPets: async ({ associatedPets }) =>
  //     await findByIds({
  //       model: Pet,
  //       ids: associatedPets,
  //       parser: `_id ${ALLOWED_CREATE.PET.join(' ')}`
  //     })
  // }
}

export default Relationships
