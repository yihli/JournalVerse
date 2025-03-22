import { createSlice } from '@reduxjs/toolkit'

import entriesService from '../services/entries'
const initialEntries = await entriesService.getAll()

const entryReducer = createSlice({
    name: 'entries',
    initialState: initialEntries,
    reducers: {
        createEntry(state, action) {
            const newEntry = action.payload
            state.push(newEntry)
        }
    }
})

export const { createEntry } = entryReducer.actions
export default entryReducer.reducer