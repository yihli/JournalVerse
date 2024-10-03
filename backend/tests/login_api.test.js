const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const config = require('../utils/config')

const api = supertest(app)

describe('Logging in', () => {
    test('Logging in with correct credentials returns 200', async () => {
        const info = {
            username: 'root',
            password: 'supersecret'
        }

        const returnedToken = await api
            .post('/api/login')
            .send(info)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const tokenCorrect = await jwt.verify(returnedToken.body.token, config.SECRET)
        assert(tokenCorrect)
    })

    test('Logging in with incorrect username returns 401', async () => {
        const info = {
            username: 'roote',
            password: 'supersecret'
        }

        const returnedToken = await api
            .post('/api/login')
            .send(info)
            .expect(401)
            .expect('Content-Type', /application\/json/)
            
    })

    test('Logging in with incorrect password returns 401', async () => {
        const info = {
            username: 'root',
            password: 'supersecrets'
        }

        const returnedToken = await api
            .post('/api/login')
            .send(info)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

after(async () => {
    await mongoose.connection.close()
})