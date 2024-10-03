const entriesRouter = require('express').Router()
const Entry = require('../models/entry')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const logger = require('../utils/logger')


entriesRouter.get('/', async (request, response) => {
    const entries = await Entry.find({}).populate('user', { username: true, id: true, name: true })

    response.status(200).json(entries)
})

entriesRouter.post('/', async (request, response, next) => {
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

    const entryObject = new Entry({
        title: body.title,
        content: body.content,
        likes: body.likes || 0,
        user: request.user.id,
        date: new Date().getTime()
    })

    logger.info(entryObject)

    try {
        const tokenCorrect = await jwt.verify(token, config.SECRET)
        const savedObject = await entryObject.save()

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

    const updatedEntry = {
        ...body
    }

    try {
        const returnedEntry = await Entry.findByIdAndUpdate(request.params.id, updatedEntry, { new: true })
        return response.status(204).end()
    } catch (error) {
        next(error)
    }
})

entriesRouter.delete('/:id', async (request, response, next) => {
    try {
        const entry = await Entry.findByIdAndDelete(request.params.id)
        await User.updateMany({}, { $pull: { likes: request.params.id } })
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = entriesRouter