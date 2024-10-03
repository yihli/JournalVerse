const mongoose = require('mongoose')
const User = require('../models/user')

const entrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: Number,
    date: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    }
})

// extracts the removed entry's id from every user's likes array.
entrySchema.pre('remove', async (next) => {
    const entryId = this._id

    await User.updateMany({}, { $pull: { likes: entryId } })

    next()
})

module.exports = mongoose.model('Entry', entrySchema)