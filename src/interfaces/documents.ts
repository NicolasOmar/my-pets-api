import mongoose from "mongoose"

export interface SelectableDataDocument extends mongoose.Document {
  name: string
}