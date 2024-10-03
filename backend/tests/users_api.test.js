const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

beforeEach(async () => {
    await User.deleteMany({ _id: { $ne: '66f4a5c453ad03a14cb70c50' }})
    // const { username, name, password } = helper.user
    
    // const passwordHash = await bcrypt.hash(password, 10)

    // const userObject = new User({
    //     username,
    //     name,
    //     passwordHash
    // })

    // await userObject.save()
})

test('Initial database condition', async () => {
    const users = await helper.usersInDb()

    assert.strictEqual(users.length, 1)
})

describe('Creating users', () => {
    test('Creating valid user returns 201', async () => {
        const usersBefore = await helper.usersInDb()

        const userObject = {
            username: 'Test123',
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        const returnedUser = await api
            .post('/api/users')
            .send(userObject)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        let usersAfter = await helper.usersInDb()
        usersAfter = usersAfter.map(user => user.username)
        assert(usersAfter.includes('Test123'))
        assert.strictEqual(usersBefore.length + 1, usersAfter.length)
    })

    test('User missing username returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('User missing name returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'Test',
            password: 'supersecret'
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)
        
        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('User missing password returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'Test',
            name: 'Arthur Morgan',
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('Duplicate username returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'root',
            name: 'farty',
            password: 'lolsdfsdfsdf',
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('Password less than 8 characters return 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'rootsdf',
            name: 'farty',
            password: '1234567',
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('Password more than 16 characters return 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'rootsdf',
            name: 'farty',
            password: '01234567891234567',
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersAfter.length, usersBefore.length)
    })

    test('Username with spaces returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'What4 ',
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        const userObject1 = {
            username: 'Wha t4',
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        const userObject2 = {
            username: ' What4',
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)
        
        await api
            .post('/api/users')
            .send(userObject1)
            .expect(400)

        await api
            .post('/api/users')
            .send(userObject2)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('Username with special characters return 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'What!',
            name: 'Arthur Morgan',
            password: 'supersecret'
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('Password with spaces returns 400', async () => {
        const usersBefore = await helper.usersInDb()
        const userObject = {
            username: 'What4',
            name: 'Arthur Morgan',
            password: 'supersecret '
        }

        const userObject1 = {
            username: 'What4',
            name: 'Arthur Morgan',
            password: 'super secret'
        }

        const userObject2 = {
            username: 'What4',
            name: 'Arthur Morgan',
            password: ' supersecret'
        }

        await api
            .post('/api/users')
            .send(userObject)
            .expect(400)
        
        await api
            .post('/api/users')
            .send(userObject1)
            .expect(400)

        await api
            .post('/api/users')
            .send(userObject2)
            .expect(400)

        const usersAfter = await helper.usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })
    
})

after(async () => {
    await mongoose.connection.close()
})