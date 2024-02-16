const mongoose = require('mongoose')
const { Schema } = mongoose


const sessionSchema = new Schema({
    inTime: {
        type: Date,
        required: [true, 'Invalid Date format']
    },
    outTime: {
        type: Date,
        required: [false, 'Invalid Date format']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session