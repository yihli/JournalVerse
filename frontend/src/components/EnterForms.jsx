import CreateAccountForm from "./CreateAccountForm"
import LoginForm from "./LoginForm"
import { useState, forwardRef, useImperativeHandle } from "react"

const EnterForms = ({ visible }) => {
    const [toShow, setToShow] = useState(0)
    
    const style = { display: visible ? '' : 'none' }

    const forms = [
        <LoginForm />,
        <CreateAccountForm />
    ]

    const switchText = [
        'Create account instead.',
        'Log in instead.'
    ]

    const switchForm = () => {
        if (toShow == 1) {
            setToShow(0)
        } else {
            setToShow(1)
        }
    }
    return (
        <div style={style}>
            {forms[toShow]}
            <button onClick={switchForm}>{switchText[toShow]}</button>
        </div>
    )
}

export default EnterForms