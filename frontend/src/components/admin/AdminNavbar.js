import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../utils/adminSlice';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAdmin(null));
    navigate('/admin/auth/login');
  };

  return (
    <>
      <div className="p-3 flex justify-between items-center bg-white sticky top-0 container mx-auto shadow-md">
        <h3 className="text-gray-700 font-semibold text-lg">Hai Admin!</h3>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-500 hover:text-white transition duration-200"
        >
          🔴 LOGOUT
        </button>
      </div>
      <hr className="border-gray-200" />
    </>
  );
}

export default AdminNavbar;
