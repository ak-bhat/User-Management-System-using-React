import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, logoutAdmin } from '../utils/adminSlice';

const useGetUsers = () => {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const adminToken = useSelector(store => store.admin.admin);
    const dispatch = useDispatch();
    
    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-users', {
                headers: {
                    authorization: `Bearer ${adminToken}`
                }
            });
            
            if (response.status === 401) {
                dispatch(logoutAdmin(null));
                return;
            } else if (!response.ok) {
                const errorMessage = await response.text();
                setError(`Error ${response.status}: ${errorMessage}`);
                return;
            }
            
            const data = await response.json();
            
            if (!data.success) {
                setError(data.message);
            } else {
                setUsers(data.data.users);
                dispatch(allUsers(data?.data?.users))
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred while fetching users');
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [adminToken]);

    return { users, error };
}

export default useGetUsers;