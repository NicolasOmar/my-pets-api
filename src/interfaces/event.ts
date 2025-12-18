import { Document } from 'mongoose'
import { MongooseDate, MongooseId } from './shared'

export interface EventObject {
  description: string
  date: MongooseDate
  associatedPets: MongooseId[]
}

export interface EventDocument extends EventObject, Document {}

// PAYLOADS
export interface EventCreatePayload {
  payload: EventObject
}

export interface EventUpdatePayload extends EventCreatePayload {
  id: string
}

export interface PetEventsGetPayload {
  petId: string
}

export interface EventGetPayload {
  eventId: string
}
