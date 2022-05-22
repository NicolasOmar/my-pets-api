import mongoose from 'mongoose'

const _mongoose = mongoose.connect(`${process.env.CONNECTION_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export default _mongoose
