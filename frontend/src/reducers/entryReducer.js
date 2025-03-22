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
        },
        deleteEntry(state, action) {
            const { id } = action.payload
            console.log('id to delete:', id)
            for(let i = 0; i < state.length; i++) {
                if (state[i].id == id) {
                    state.splice(i)
                }
            }
        }

    }
})

export const { createEntry, deleteEntry } = entryReducer.actions
export default entryReducer.reducer