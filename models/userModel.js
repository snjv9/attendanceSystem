const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    sessions: {
        type: [{ type: mongoose.Schema.ObjectId, ref: 'Session' }]

    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // select: false
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User