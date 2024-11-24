import mongoose, { Types } from "mongoose";

export interface EventDocument {
  description: string,
  date: mongoose.Schema.Types.Date
  associatedPets: Types.ObjectId[]
}