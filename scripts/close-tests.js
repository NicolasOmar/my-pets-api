const { default: mongoose } = require("mongoose")

module.exports = async () => {
  await mongoose.connection.dropDatabase()
  process.exit(0)
}