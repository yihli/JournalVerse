import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import App from './App'

import entryReducer from './reducers/entryReducer'
import userReducer from './reducers/userReducer'



const store = configureStore({
    reducer: {
        entries: entryReducer,
        user: userReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
)

