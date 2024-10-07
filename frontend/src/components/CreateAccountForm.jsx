import { useState, useRef } from 'react'
import usersService from '../services/users'

const CreateAccountForm = ({ setLoginState }) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    // React reference to the submit button
    const submitButton = useRef(null)

    // show error for 5 seconds
    const showError = (message) => {
        setErrorMessage(message)

        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }

    // form submit
    const handleFormSubmit = async (event) => {
        event.preventDefault()

        // all fields must be filled.
        if (username == '' || name == '' || password == '' || rePassword == '') {
            return showError('Please fill in all fields.')
        }

        // username must only contain certain characters.
        if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return showError('Username must only contain numbers, letters, dots, underscores.')
        }
    
        // retyped password should match original
        if (password !== rePassword) {
            return showError('Retyped password does not match.')
        }

        // password length constraint
        if (password.length < 8 || password.length > 16) {
            return showError('Password must be between 8 and 16 characters long.')
        }
        
        // object with entered details
        const userDetails = {
            username,
            name: name.replace(/\s+/g, ' ').replace(/\s+$/, ''), // only allow one space between words, no trailing spaces
            password,
            rePassword
        }

        try {
            // access the user creation API to store a new user in the database
            const returnedDetails = await usersService.createOne(userDetails)

            // prevent double submits 
            submitButton.current.disabled = true;

            // redirect user to login form
            showError('Account created, please log in with your new details. Redirecting...')
            setTimeout(() => {
                setLoginState(true)
            }, 3000)
        } catch (error) {
            console.log(error)
            // failure allows user to submit new form
            showError(`Error: ${error.response.data.error}`)
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