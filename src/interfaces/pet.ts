import { Document } from 'mongoose'
import { MongooseDate, MongooseId } from './shared'

export interface PetObject {
  name: string
  petType: MongooseId
  birthday: MongooseDate | null
  isAdopted: boolean
  adoptionDate: MongooseDate | null
  weight: number
  gender: boolean
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
  payload: PetObjectSimple
}

export interface PetUpdatePayload extends PetCreatePayload {
  id: string
}

export interface PetGetPayload {
  petId: string
}
