import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'

import App from './App'


import entriesService from './services/entries'
const initialEntries = await entriesService.getAll()
const newReducer = createSlice({
    name: 'entries',
    initialState: initialEntries,
    reducers: {
        createEntry(state, action) {
            const newEntry = action.payload
            state.push(newEntry)
        }
    }
})

const store = configureStore({
    reducer: {
        entries: newReducer.reducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)

