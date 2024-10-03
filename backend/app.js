const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const entriesRouter = require('./controllers/entries')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected!')
    })
    .catch(error => {
        console.log('Error connecting:', error.message)
    })

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/entries', entriesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)


module.exports = app