import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addUser, logoutAdmin } from "../../utils/adminSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminAddUser = () => {
  const [error, setError] = useState(null);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const adminToken = useSelector((store) => store.admin.admin);
  const navigate = useNavigate();

  const onSubmit = async (userData) => {
    console.log(adminToken);
    
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/add-new-user',
        {
          method: "post",
          headers: {
            authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.status === 401) {
        dispatch(logoutAdmin(null));
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        console.log(data.message);
      } else {
        console.log("user"+data);
        dispatch(addUser(data));
        navigate("/admin");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-lg p-8 bg-white rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          ➕ Add User
        </h2>
        {error && (
          <h2 className="text-center mb-4 text-red-500 text-sm">{error}</h2>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register("username", {
                required: true,
                minLength: 4,
                maxLength: 15,
              })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">
                Username is required
              </p>
            )}
            {errors.username?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">
                Username should have at least 4 characters
              </p>
            )}
            {errors.username?.type === "maxLength" && (
              <p className="text-red-500 text-xs mt-1">
                Username is too long
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              })}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
            {errors.email?.type === "pattern" && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">
                Password should be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirm_password", {
                required: true,
                validate: (val) =>
                  watch("password") === val || "Passwords do not match",
              })}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none"
            >
              Add Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
