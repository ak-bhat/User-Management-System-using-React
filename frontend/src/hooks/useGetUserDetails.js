import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../utils/adminSlice";
import { useNavigate } from "react-router-dom";

const useGetUserDetails = (userID) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const adminToken = useSelector(store => store?.admin?.admin);
    const [userDetails, setUserDetails] = useState(null);
    

    const fetchSingleUserDetails = async(userID) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/get-user/"+userID, 
                {
                    headers:{
                        authorization: `Bearer ${adminToken}`
                    }
                }
            );
            if(response.status === 401){
                dispatch(logoutAdmin(null));
                navigate('/admin/auth/login');
            }

            const data = await response.json();
            console.log("data after fetching: ",data.data.user);
            setUserDetails(data?.data?.user);
        } catch (error) {
            console.log("singleUserError: ", error.message)
        }
    }
    
    useEffect(()=> {
        fetchSingleUserDetails(userID)
    }, [userID]);
    
    return userDetails;
}

export default useGetUserDetails