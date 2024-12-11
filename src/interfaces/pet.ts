import { Document } from 'mongoose'
import { MongooseDate, MongooseId } from './shared'

export interface PetObject {
  name: string
  petType: MongooseId
  birthday: MongooseDate | null
  isAdopted: boolean
  adoptionDate: MongooseDate | null
  height: number
  length: number
  weight: number
  gender: string
  hairColors: MongooseId[]
  eyeColors: MongooseId[]
  hasHeterochromia: boolean
  passedAway: boolean
  user: MongooseId
  events: MongooseId[]
}

export type PetObjectSimple = Omit<PetObject, 'user' | 'events'>

export interface PetDocument extends PetObject, Document {}

// PAYLOADS
export interface PetCreatePayload {
  petPayload: PetObjectSimple
}

export interface PetUpdatePayload extends PetCreatePayload {
  id: string
}
