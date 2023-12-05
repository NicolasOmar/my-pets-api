import { Schema, model } from 'mongoose'
// FUNCTIONS
import { parseErrorMsg } from '../../functions/parsers'

const eventSchema = new Schema({
  description: {
    type: String,
    required: [true, parseErrorMsg.missingValue('Description', 'Event')],
    minlength: [2, parseErrorMsg.minMaxValue('Name', 3, true)],
    maxlength: [200, parseErrorMsg.minMaxValue('Name', 200, false)]
  },
  date: {
    type: String,
    required: [true, parseErrorMsg.missingValue('Date', 'Event')]
  },
  associatedPets: {
    type: [Schema.Types.ObjectId],
    required: [true, parseErrorMsg.missingValue('Pet', 'Event')],
    ref: 'Pet'
  }
})

const Event = model('Event', eventSchema)

export default Event
