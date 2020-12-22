const mongoose = require('mongoose')

mongoose.connect(`${process.env.CONNECTION_URL}`, {
  useNewUrlParser: true,
  useCreateIndex: true, //ACCESS TO DATA NEEDED
  useFindAndModify: true,
  useUnifiedTopology: true
})

module.exports = mongoose
