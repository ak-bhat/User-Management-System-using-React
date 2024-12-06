import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, setUserProfilePic } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const useLoginUser = () => {
    const[user, setUser] = useState(null);
    const [error, setError] = useState(null)
    const userToken = useSelector(store => store?.user?.userToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const fetchUserDetails = async() => {
        let resp = await fetch("http://localhost:3000/api/user/get-user",
            {
                method:"get",
                headers:{
                    authorization: `Bearer ${userToken}`
                }
            }
        )
        if(resp.status===401){
            dispatch(logoutUser());
            navigate('/auth/login')
        }
        let jsonData = await resp.json()
        if(!jsonData.success){
            console.log(jsonData.message);
            setError(jsonData.message)
        }else{
            dispatch(setUserProfilePic(jsonData?.data?.user?.profile_pic))
            setUser(jsonData.data.user)
            
        }
    }

    useEffect(() => {fetchUserDetails()}, [])
  
    return {user, error};
}

export default useLoginUser