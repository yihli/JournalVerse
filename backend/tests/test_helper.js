const Entry = require('../models/entry')
const User = require('../models/user')

const entries = [
    {
        title: "first",
        content: "my first",
        likes: 0,
    },
    {
        title: "second",
        content: "my second",
        likes: 0,
    },
    {
        title: "third",
        content: "my third",
        likes:0,
    }
]

const entriesInDb = async () => {
    const entries = await Entry.find({})
    return entries
}

const user = {
    username: 'root',
    name: 'user',
    password: 'supersecret'
}

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    entries,
    entriesInDb,

    user,
    usersInDb
}