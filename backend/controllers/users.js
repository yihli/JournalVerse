const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// user creation
usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    // missing password or incorrect password returns failure
    if (!password) {
        return response.status(400).send({ error: 'missing password' })
    }
    if (password.length < 8 || password.length > 16) {
        return response.status(400).send({ error: 'password must be between 8-16 characters long'})
    }

    // password must not contain spaces
    const noWhitespaceRegex = /^[^\s]+$/
    if (!noWhitespaceRegex.test(password)) {
        return response.status(400).send({ error: 'password must not contain spaces' })
    }

    // bcrypt creates a hashed password so it's not just the plain text password that's saved to the database
    const passwordHash = await bcrypt.hash(password, 10)

    const userObject = new User({
        username,
        name,
        passwordHash,
    })

    try {
        const returnedUser = await userObject.save()
        response.status(201).send(returnedUser)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', async (request, response, next) => {
    try {
        // replace the entry id reference with the entry details
        const users = await User.find({}).populate('entries', { title: true, content: true, likes: true, id: true })
        response.status(200).send(users)
    } catch (error) {
        next(error)
    }

})

usersRouter.get('/:id', async (request, response, next) => {
    try {
        const user = await User.findById(request.params.id).populate('entries')
        response.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

usersRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    try {
        // mongoose and MongoDB know to only update any changed fields
        const user = await User.findByIdAndUpdate(request.params.id, body, { new : true })
        console.log(user)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter