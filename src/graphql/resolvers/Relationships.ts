// DB MODELS
import PetEntity from '@models/pet.model'
import UserEntity from '@models/user.model'
import PetTypeEntity from '@models/petType.model'
import ColorEntity from '@models/color.model'
import EventEntity from '@models/event.model'
// CONSTANTS
import { ALLOWED_CREATE } from '@constants/allowedFields.json'
// FUNCTIONS
import { findByIds } from '@functions/parsers'
import { SecondaryData, TypedRelationship } from '@interfaces/other'
import { PetDocument } from '@interfaces/pet'
import { UserDocument } from '@interfaces/user'
import { EventDocument } from '@interfaces/event'

interface RelationshipsInterface {
  UserEntity: {
    pets: TypedRelationship<{ userName: string }, PetDocument[]>
  }
  PetEntity: {
    user: TypedRelationship<{ user: string }, UserDocument | null>,
    petType: TypedRelationship<{ petType: string }, SecondaryData | SecondaryData[]>
    hairColors: TypedRelationship<{ hairColors: string }, SecondaryData | SecondaryData[]>
    eyeColors: TypedRelationship<{ eyeColors: string }, SecondaryData | SecondaryData[]>
    // events: TypedRelationship<{ events: string[] }, SecondaryData | SecondaryData[]>
  }
  // EventEntity: {
  //   associatedPets: TypedRelationship<{ associatedPets: string[] }, PetDocument | PetDocument[]>
  // }
}

const Relationships: RelationshipsInterface = {
  UserEntity: {
    pets: async ({ userName }) => {
      const user = userName ? (await UserEntity.findOne({ userName }))?._id : null
      return await PetEntity.find({ user })
    }
  },
  PetEntity: {
    user: async ({ user }) => await UserEntity.findById(user),
    petType: async ({ petType }) =>
      await findByIds({
        model: PetTypeEntity,
        ids: petType
      }),
    hairColors: async ({ hairColors }) =>
      await findByIds({
        model: ColorEntity,
        ids: hairColors
      }),
    eyeColors: async ({ eyeColors }) =>
      await findByIds({
        model: ColorEntity,
        ids: eyeColors
      }),
    // events: async ({ events }) =>
    //   await findByIds({
    //     model: EventEntity,
    //     ids: events,
    //     parser: `_id ${ALLOWED_CREATE.EVENT.join(' ')}`
    //   })
  },
  // EventEntity: {
  //   associatedPets: async ({ associatedPets }) =>
  //     await findByIds({
  //       model: PetEntity,
  //       ids: associatedPets,
  //       parser: `_id ${ALLOWED_CREATE.PET.join(' ')}`
  //     })
  // }
}

export default Relationships
