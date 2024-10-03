const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const Entry = require('../models/entry')
const User = require('../models/user')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

let token = ''

beforeEach(async () => {
    // login for the token
    const returnedData = await api
    .post('/api/login')
    .send({
        username: 'root',
        password: 'supersecret',
    })
    token = returnedData.body.token

    // delete all test entries
    await Entry.deleteMany({}) 

    // reset the Entry references stored in the test user
    const user = await User.findById('66f4a5c453ad03a14cb70c50')
    user.entries = []
    await user.save()
    
    // upload the default template entries
    const entryObjects = helper.entries.map(entry => new Entry(entry))
    const promiseObjects = entryObjects.map(entryObject => entryObject.save())
    await Promise.all(promiseObjects)
})

test('Initial database condition', async () => {
    
    const entries = await helper.entriesInDb()

    assert.strictEqual(entries.length, helper.entries.length)
})

describe('Creating entries', () => {
    test('Valid entry returns 201', async () => {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            content: 'Test',
            likes: 0,
        }

        await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        let entriesAfter = await helper.entriesInDb()
        entriesAfter = entriesAfter.map(entry => entry.title)
        assert.strictEqual(entriesBefore.length + 1, entriesAfter.length)
        assert(entriesAfter.includes('Test'))
    })

    test('Creating with incorrect token returns 401', async () => {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            content: 'Test',
            likes: 0,
        }

        await api
            .post('/api/entries')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJuYW1lIjoiWWkgTGkiLCJpYXQiOjE3MjYxODg4MDh9.0LlhAR3jjjoC0XA5sS1DGmJhZlunQLO1v_IdbmB0_T')
            .send(testEntry)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
        let entriesAfter = await helper.entriesInDb()
        entriesAfter = entriesAfter.map(entry => entry.title)
        assert.strictEqual(entriesBefore.length, entriesAfter.length)
    })

    test('Creating with missing token returns 401', async () => {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            content: 'Test',
            likes: 0,
        }

        const returnedError = await api
            .post('/api/entries')
            // .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJuYW1lIjoiWWkgTGkiLCJpYXQiOjE3MjYxODg4MDh9.0LlhAR3jjjoC0XA5sS1DGmJhZlunQLO1v_IdbmB0_T')
            .send(testEntry)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
        let entriesAfter = await helper.entriesInDb()
        entriesAfter = entriesAfter.map(entry => entry.title)
        assert.strictEqual(entriesBefore.length, entriesAfter.length)
    })

    test('Entry missing title returns 400', async ()=> {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            content: 'Test',
            likes: 0,
        }

        await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(400)
        
        let entriesAfter = await helper.entriesInDb()
        assert.strictEqual(entriesBefore.length, entriesAfter.length)
    })

    test('Entry missing content returns 400', async ()=> {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            likes: 0,
        }

        await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(400)
        
        let entriesAfter = await helper.entriesInDb()
        assert.strictEqual(entriesBefore.length, entriesAfter.length)
    })

    test('Entry missing likes defaults to 0', async ()=> {
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            content: 'Test',
            title: 'Test',
        }

        await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        let entriesAfter = await helper.entriesInDb()
        entriesAfter = entriesAfter.filter(entry => entry.likes === 0)
        assert.strictEqual(entriesBefore.length + 1, entriesAfter.length)
    })
})

describe('Accessing entries', () => {
    test('Accessing entry with correct ID returns 200', async () => {
        const entries = await helper.entriesInDb()
        const id = entries[0].id

        const returnedEntry = await api
            .get(`/api/entries/${id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(entries[0].title, returnedEntry.body.title)
    })

    test('Accessing entry with incorrect ID returns 400', async () => {
        const entries = await helper.entriesInDb()
        const id = 'stupid123'

        const returnedEntry = await api
            .get(`/api/entries/${id}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Updating entries', () => {
    test('Updating entry with valid object returns 204', async () => {
        const entriesBefore = await helper.entriesInDb()
        const id = entriesBefore[0].id

        const updatedEntry = {
            title: 'Update',
            content: 'Update',
            likes: 2,
        }

        await api
            .put(`/api/entries/${id}`)
            .send(updatedEntry)
            .expect(204)
        
        let entriesAfter = await helper.entriesInDb()
        assert(entriesAfter.some(entry => {
            return entry.title === 'Update' && entry.content === 'Update' && entry.likes === 2
        }))
        
    })

    test('Updating only content returns 204', async () => {
        const entriesBefore = await helper.entriesInDb()
        const id = entriesBefore[0].id

        const updatedEntry = {
            content: 'Update',
        }

        await api
            .put(`/api/entries/${id}`)
            .send(updatedEntry)
            .expect(204)
        
        let entriesAfter = await helper.entriesInDb()
        assert(entriesAfter.some(entry => {
            return entry.title === entriesBefore[0].title && entry.content === 'Update' && entry.likes === entriesBefore[0].likes
        }))
    })

    test('Updating only title returns 204', async () => {
        const entriesBefore = await helper.entriesInDb()
        const id = entriesBefore[0].id

        const updatedEntry = {
            title: 'Bonanza'
        }

        await api
            .put(`/api/entries/${id}`)
            .send(updatedEntry)
            .expect(204)
        
        let entriesAfter = await helper.entriesInDb()
        assert(entriesAfter.some(entry => {
            return entry.title === 'Bonanza' && entry.content === entriesBefore[0].content && entry.likes === entriesBefore[0].likes
        }))
    })

    test('Updating only likes returns 204', async () => {
        const entriesBefore = await helper.entriesInDb()
        const id = entriesBefore[0].id

        const updatedEntry = {
            likes: 5012
        }

        await api
            .put(`/api/entries/${id}`)
            .send(updatedEntry)
            .expect(204)
        
        let entriesAfter = await helper.entriesInDb()
        assert(entriesAfter.some(entry => {
            return entry.title === entriesBefore[0].title && entry.content === entriesBefore[0].content && entry.likes === 5012
        }))
    })
})

describe('Saves user details correctly', () => {
    test('Saved entry refers to correct user', async () => {
        await Entry.deleteMany({})
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            content: 'Test',
            likes: 0,
        }

        await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        let entriesAfter = await helper.entriesInDb()
        entriesAfter = entriesAfter.map(entry => entry.user.toString())
        assert.strictEqual(entriesBefore.length + 1, entriesAfter.length)
        console.log(entriesAfter)
        assert(entriesAfter.includes('66f4a5c453ad03a14cb70c50'))
    })

    test('User refers to the correct entry', async () => {
        await Entry.deleteMany({})

        
        const entriesBefore = await helper.entriesInDb()
        const testEntry = {
            title: 'Test',
            content: 'Test',
            likes: 0,
        }

        const savedEntry = await api
            .post('/api/entries')
            .set('Authorization', `Bearer ${token}`)
            .send(testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const user = await User.findById(savedEntry._body.user)

        const userEntries = user.entries.map(id => id.toString())
        // let entriesAfter = await helper.entriesInDb()
        // entriesAfter = entriesAfter.map(entry => entry.user.toString())
        // assert.strictEqual(entriesBefore.length + 1, entriesAfter.length)
        // console.log(entriesAfter)
        // console.log('userEntries:', userEntries)
        // console.log('savedEntry:', savedEntry)
        assert(userEntries.includes(savedEntry._body.id))
    })
}) 

after(async () => {
    await mongoose.connection.close()
})