import mongoose from 'mongoose'

const _mongoose = mongoose.connect(`${process.env.CONNECTION_URL}`)

export default _mongoose
