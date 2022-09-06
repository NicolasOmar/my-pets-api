const { default: mongoose } = require("mongoose")

module.exports = () => mongoose.connection.db.dropDatabase(() => process.exit(0))