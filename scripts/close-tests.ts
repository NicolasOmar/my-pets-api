import mongoose from "mongoose"

export default async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  process.exit(0)
}