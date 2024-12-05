import React, { useEffect, useState } from 'react';
import useGetUsers from '../../hooks/useGetUsers';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, deleteUser, logoutAdmin } from '../../utils/adminSlice';

const AdminHome = () => {
  const { error } = useGetUsers();
  const users = useSelector((store) => store?.admin?.users);
  const [allUsersArray, setAllUsersArray] = useState(users);
  const adminToken = useSelector((store) => store?.admin?.admin);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setAllUsersArray(users);
  }, [users]);

  const handleDeleteUser = async (userID) => {
    console.log(userID);
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      const response = await fetch(
        `http://localhost:5000/api/admin/delete-user/${userID}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.status === 401) {
        dispatch(logoutAdmin(null));
        return;
      } else if (!response.ok) {
        console.log(await response.text());
        return;
      }

      const data = await response.json();
      if (!data.success) {
        console.log(data.message);
      } else {
        console.log(data);
        dispatch(deleteUser(userID));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortUser = (sort) => {
    let usersArr = [...allUsersArray];
    const usersSorted = usersArr.sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();
      return sort === 'atz'
        ? usernameA.localeCompare(usernameB)
        : usernameB.localeCompare(usernameA);
    });
    setAllUsersArray(usersSorted);
  };

  const handleSearchUsers = () => {
    console.log(query);
    const searchResults = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setAllUsersArray(searchResults);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {error && <h2 className="text-center text-red-500">{error}</h2>}
      {!error && (
        <>
          {/* Admin search, sort, and filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="border rounded-lg p-2 w-64 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Search users"
              />
              <button
                onClick={handleSearchUsers}
                id="userSearchBtn"
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                🔍
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort by
                </button>
                <ul className="absolute bg-white border mt-2 rounded-lg shadow-md">
                  <li
                    onClick={() => handleSortUser('atz')}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    A - Z
                  </li>
                  <li
                    onClick={() => handleSortUser('zta')}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Z - A
                  </li>
                </ul>
              </div>

              <Link
                to={'/admin/add-user'}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add User
              </Link>
            </div>
          </div>

          <h1 className="text-center text-2xl font-semibold text-gray-700 mb-6">
            Users
          </h1>

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th className="px-4 py-2 border border-gray-300">Username</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsersArray?.map((user) => (
                <tr key={user?._id}>
                  <td className="px-4 py-2 border border-gray-300">{user?._id}</td>
                  <td className="px-4 py-2 border border-gray-300">{user?.username}</td>
                  <td className="px-4 py-2 border border-gray-300">{user?.email}</td>
                  <td className="px-4 py-2 border border-gray-300 flex items-center space-x-3">
                    <Link
                      to={`/admin/update-user/${user?._id}`}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user?._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminHome;
