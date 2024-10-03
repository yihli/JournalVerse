import axios from 'axios'
const baseUrl = '/api/login'

const login = async (userDetails) => {
    const loginInfo = {
        username: userDetails.username,
        password: userDetails.password
    }

    const response = await axios.post(baseUrl, loginInfo)
    return response.data
}

export default {
    login
}