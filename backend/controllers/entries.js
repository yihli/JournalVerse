const entriesRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Entry = require('../models/entry')
const User = require('../models/user')

const config = require('../utils/config')
const logger = require('../utils/logger')


entriesRouter.get('/', async (request, response, next) => {
    try {
        // get all entries from MongoDB, replacing the user references with the user details
        const entries = await Entry.find({}).populate('user', { username: true, id: true, name: true })
        response.status(200).json(entries)
    } catch (error) {
        next(error)
    }
})

entriesRouter.post('/', async (request, response, next) => {

    // missing tokens or user means there is no one to attribute the new post to
    if (!request.token) {
        return response.status(401).send({ error: 'missing token' })
    }
    if (!request.user) {
        return response.status(401).send({ error: 'missing user' })
    }

    const body = request.body
    const token = request.token
    const currentUser = await User.findById(request.user.id)

    logger.info('Current user:', currentUser)

    // entry should contain the user's included details as well as the user's id and current time
    const entryObject = new Entry({
        title: body.title,
        content: body.content,
        likes: body.likes || 0,
        user: request.user.id,
        date: new Date().getTime()
    })

    logger.info(entryObject)

    try {
        // must confirm the token is valid to save the entry
        const tokenCorrect = await jwt.verify(token, config.SECRET)
        const savedObject = await entryObject.save()

        // update the posted user's document to contain the new entry
        currentUser.entries = currentUser.entries.concat(entryObject._id)
        await currentUser.save()

        response.status(201).send(savedObject)
    } catch (error) {
        next(error)
    }
})

entriesRouter.get('/:id', async (request, response, next) => {
    try {
        const returnedEntry = await Entry.findById(request.params.id).populate('user')
        response.status(200).send(returnedEntry)
    } catch (error) {
        next(error)
    }
})

entriesRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    // object containing updated fields
    const updatedEntry = {
        ...body
    }

    try {
        // mongoose and mongoDB knows to only update the fields that are changed
        const returnedEntry = await Entry.findByIdAndUpdate(request.params.id, updatedEntry, { new: true })
        return response.status(204).end()
    } catch (error) {
        next(error)
    }
})

entriesRouter.delete('/:id', async (request, response, next) => {
    try {
        const entry = await Entry.findByIdAndDelete(request.params.id)

        // removes the deleted entry's id from the liked array of every user, if they liked it
        await User.updateMany({}, { $pull: { likes: request.params.id } })
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = entriesRouter