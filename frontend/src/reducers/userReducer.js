import { createSlice } from '@reduxjs/toolkit'

const userReducer = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUser(state, action) {
            const newUser = action.payload
            Object.assign(state, newUser)
        }
    }
})

export const { setUser } = userReducer.actions
export default userReducer.reducer