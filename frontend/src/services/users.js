import axios from 'axios'
const userUrl = '/api/users'
let user = ''

const setUser = (userDetails) => {
    user = userDetails
    console.log('User set as', user)
}

const getCurrentUserId = () => {
    return user === '' ? '' : user.id
}

const getCurrentUser = async () => {
    const response = await axios.get(`${userUrl}/${user.id}`)
    return response.data
}

const toggleLike = async (noteId) => {
    const response = await axios.get(`${userUrl}/${user.id}`)
    const userObject = response.data
    console.log(userObject)


    if (userObject.likes.includes(noteId)) {
        console.log('already like it')
    } else {
        console.log('did not like it yety')
    }
}

const updateOne = async (updatedObject) => {
    const response = await axios.put(`${userUrl}/${user.id}`, updatedObject)
}

const createOne = async (newUserDetails) => {
    const response = await axios.post(`${userUrl}`, newUserDetails)
    return response.data
}

export default {
    setUser,
    toggleLike,
    updateOne,
    getCurrentUser,
    getCurrentUserId,
    createOne
}