import axios from 'axios'
const baseUrl = '/api/entries'
let token = ''

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
    console.log('token set as', token)
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const updateOne = async (id, entry) => {
    const response = await axios.put(`${baseUrl}/${id}`, entry)
    return response.data
}

const createOne = async (entry) => {
    const headers = {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    }

    const response = await axios.post(baseUrl, entry, headers)
    return response.data
}

const deleteOne = async (id) => {
    const response = await axios.delete(id)
    return response.data
}

export default {
    getAll,
    getOne,
    updateOne,
    createOne,
    setToken,
    deleteOne
}