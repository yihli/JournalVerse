const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Body:', request.body)
    logger.info('Path:', request.path)
    logger.info('---------------')

    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } 
    next()
}

const userExtractor = (request, response, next) => {
    if (request.token) {
        const decodedToken = jwt.verify(request.token, config.SECRET)
        request.user = decodedToken
    }
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.info(error)
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'CastError') {
        return response.status(400).send({ error: 'invalid id' })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
        return response.status(400).send({ error: 'Duplicate usernames not allowed' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).send({ error: error.message })
    }

    return response.status(400).send({ error: 'Unknown error' })
    next(error)
}

module.exports = {
    requestLogger,
    errorHandler,
    tokenExtractor,
    userExtractor
}