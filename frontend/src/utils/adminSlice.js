import { createSlice } from '@reduxjs/toolkit'

export const adminSlice = createSlice({
  name: 'admin',
  initialState:{
    admin:JSON.parse(localStorage.getItem('adminTkn')) ?? null,
    users : []
  },
  reducers: {
    loginAdmin: (state, action) => {
        state.admin = action.payload
        localStorage.setItem("adminTkn", JSON.stringify(action.payload))
    },
    logoutAdmin: (state, action) => {
        state.admin = action.payload
        localStorage.setItem("adminTkn", JSON.stringify(action.payload))
    },
    allUsers : (state, action) => {
      state.users = action.payload;
    },
    addUser : (state, action) => {
      state.users = [...state.users, action.payload]
    },
    deleteUser:(state, action) => {
      state.users = state.users.filter(u => u._id !== action.payload)
    }
  },
})

export const { 
  loginAdmin, 
  logoutAdmin,
  allUsers,
  deleteUser,
  addUser,
 } = adminSlice.actions

export default adminSlice.reducer