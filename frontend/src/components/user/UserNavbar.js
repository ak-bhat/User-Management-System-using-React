import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <>
      <div className="p-4 flex justify-between items-center bg-gray-200 sticky top-0 shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">❤️ Hai</h3>
        <div className="flex space-x-4">
          <Link
            to="/profile"
            className="px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-300 focus:outline-none"
          >
            🐧 Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white focus:outline-none"
          >
            🔴 Logout
          </button>
        </div>
      </div>
      <hr />
    </>
  );
};

export default UserNavbar;
