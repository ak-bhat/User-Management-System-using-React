import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const userSlice = createSlice({
    name: "user",
    initialState:{
        username:JSON.parse(localStorage.getItem("authUsername")) ?? null,
        userToken : JSON.parse(localStorage.getItem("authUserToken")) ?? null,
        userID : JSON.parse(localStorage.getItem("authUserID")),
        userProflePic : null
    },
    reducers:{
        loginUser : (state, action) => {
            console.log(action.payload)
            state.userToken = action.payload.userToken
            state.username = action.payload.username
            state.userID = action.payload.userID
            localStorage.setItem("authUsername", JSON.stringify(action.payload.username))
            localStorage.setItem("authUserToken", JSON.stringify(action.payload.userToken))
            localStorage.setItem("authUserID", JSON.stringify(action.payload.userID))
        },
        logoutUser : (state, action) => {
            localStorage.removeItem("authUsername")
            localStorage.removeItem("authUserToken")
            localStorage.removeItem("authUserID" )
            state.userToken = null;
            state.username = null;
            state.userID = null;
        },
        setUserProfilePic : (state, action) => {
            // console.log(action.payload);
            
            state.userProflePic = action.payload
        }
}
})

export const {
    loginUser,
    logoutUser,
    setUserProfilePic,
} = userSlice.actions;

export default userSlice.reducer;