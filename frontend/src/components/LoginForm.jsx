import loginService from '../services/login'
import entriesService from '../services/entries'
import usersService from '../services/users'

import { useState } from 'react'

const LoginForm = ({ setUser, setUserLikedEntries }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const showError = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        console.log('Hello')

        try {
            const userData = await loginService.login({ username, password })
            // setUser(userData)
            entriesService.setToken(userData.token)
            usersService.setUser(userData)

            const fullUser = await usersService.getCurrentUser()
            setUserLikedEntries(fullUser.likes)
            setUser(fullUser)

        } catch (error) {
            console.log('Error occurred while logging in')
            showError('Incorrect username or password.')
        }
    }

    return (
        <div className="login-form-container pop">
            <h1>Login</h1>
            <p className="red">{errorMessage}</p>
            <form className="login-form" onSubmit={handleFormSubmit} id="login-form">
                <input type="text" placeholder="username" onChange={({target}) => setUsername(target.value)}/>
                <input type="password" placeholder="password" onChange={({target}) => setPassword(target.value)}/>
            </form>
            <button className="login-form-submit-button" type="submit" form="login-form">Login</button>
        </div>
    )
}

export default LoginForm