import { useState, useRef } from 'react'
import usersService from '../services/users'

const CreateAccountForm = ({ setLoginState }) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const submitButton = useRef(null)

    const showError = (message) => {
        setErrorMessage(message)

        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()

        if (username == '' || name == '' || password == '' || rePassword == '') {
            return showError('Please fill in all fields.')
        }

        if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return showError('Username must only contain numbers, letters, dots, underscores.')
        }

        if (password !== rePassword) {
            return showError('Retyped password does not match.')
        }

        if (password.length < 8 || password.length > 16) {
            return showError('Password must be between 8 and 16 characters long.')
        }
        
        const userDetails = {
            username,
            name: name.replace(/\s+/g, ' ').replace(/\s+$/, ''), // only allow one space between words, no trailing spaces
            password,
            rePassword
        }

        console.log(userDetails)
        try {
            const returnedDetails = await usersService.createOne(userDetails)
            console.log(returnedDetails)
            submitButton.current.disabled = true;
            showError('Account created, please log in with your new details. Redirecting...')

            setTimeout(() => {
                setLoginState(true)
            }, 3000)
        } catch (error) {
            console.log(error)
            submitButton.current.disabled = false;
        }
    }

    return (
        <div className="create-account-form-container pop">
            <h1>Create an account</h1>
            <p className="red">{errorMessage}</p>
            <form className="create-account-form" id="create-account-form" onSubmit={handleFormSubmit}>
                <input type="text" placeholder="name" onChange={({target}) => setName(target.value)} value={name}/>
                <input type="text" placeholder="username" onChange={({target}) => setUsername(target.value.replace(/\s/g, ''))} value={username}/>
                <input type="password" placeholder="password" onChange={({target}) => setPassword(target.value.replace(/\s/g, ''))} value={password}/>
                <input type="password" placeholder="retype password" onChange={({target}) => setRePassword(target.value.replace(/\s/g, ''))} value={rePassword}/>
            </form>
            <button className="create-account-form-submit-button" form="create-account-form" ref={submitButton}>Create Account</button>
        </div>
    )
}
export default CreateAccountForm