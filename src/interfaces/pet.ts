import mongoose, { Document, Types } from 'mongoose'

export interface PetDocument extends Document {
  name: string
  petType: Types.ObjectId
  birthday: mongoose.Schema.Types.Date
  isAdopted: boolean
  adoptionDate: mongoose.Schema.Types.Date
  height: number
  length: number
  weight: number
  gender: string
  hairColors: Types.ObjectId[]
  eyeColors: Types.ObjectId[]
  hasHeterochromia: boolean
  passedAway: boolean
  user: Types.ObjectId
  events: Types.ObjectId[]
}
