const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('../utils/config')

const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    // username must exist for a successful login
    const user = await User.findOne({ username })
    if (!user) {
        return response.status(401).send({ error: 'incorrect username or password' })
    }

    // password must be correct for a sucessful login
    // bcrypt compares the given password to the passwordHash stored in the user's document
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return response.status(401).send({ error: 'incorrect username or password' })
    }

    // if login successful, create a jsonwebtoken which will allow the API to recognize the user
    // as a valid, logged in user
    const tokenData = {
        username: user.username,
        id: user.id
    }
    const token = await jwt.sign(tokenData, config.SECRET)

    // return the token for use 
    response.status(200).json({
        token,
        username: user.username,
        id: user.id
    })
})

module.exports = loginRouter