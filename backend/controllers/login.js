const loginRouter = require('express').Router()
const logger = require('../utils/logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    if (!user) {
        return response.status(401).send({ error: 'incorrect username or password' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
        return response.status(401).send({ error: 'incorrect username or password' })
    }

    const tokenData = {
        username: user.username,
        id: user.id
    }

    const token = await jwt.sign(tokenData, config.SECRET)

    response.status(200).json({
        token,
        username: user.username,
        id: user.id
    })
})

module.exports = loginRouter