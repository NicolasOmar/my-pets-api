import mongoose from "mongoose"

export default async () => {
  await mongoose.connection.dropDatabase()
  process.exit(0)
}