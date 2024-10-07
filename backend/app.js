const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const middleware = require('./utils/middleware')
const config = require('./utils/config')

const entriesRouter = require('./controllers/entries')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

// connect to the database
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected!')
    })
    .catch(error => {
        console.log('Error connecting:', error.message)
    })

// express.json creates a request.body that stores the data included within a request
// static('dist') serves the static frontend files; the built html, css, javascript files 
// cors() allows origins of different ports or different origins to access the current domain
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

// requestLogger records every request that goes through the api
// tokenExtractor sets request.token to the authorization token
// userExtractor sets request.user to the current user's details
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

// API routes
app.use('/api/entries', entriesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// any error that shows up is caught by the error handler and printed if it's a known error
app.use(middleware.errorHandler)

module.exports = app