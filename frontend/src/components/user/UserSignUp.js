import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../utils/userSlice";

const UserSignup = () => {
  const [error, setError] = useState(null);
  const { register, formState: { errors }, watch, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const resp = await fetch('http://localhost:3000/api/user/signup', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await resp.json();
      if (!jsonData.success) {
        console.log(jsonData.message);
        setError(jsonData.message);
      } else {
        console.log(jsonData.data);
        const { username, userId, token } = jsonData?.data;
        dispatch(loginUser({ username, userID: userId, userToken: token }));
        navigate("/");
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-lg p-8 bg-white rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          Hi, Signup Please
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && <h5 className="text-center text-red-500">{error}</h5>}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              placeholder="Enter your username"
              {...register("username", { required: true, minLength: 4, maxLength: 24 })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Username is required</p>
            )}
            {errors.username?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">Username should have at least 4 characters</p>
            )}
            {errors.username?.type === "maxLength" && (
              <p className="text-red-500 text-xs mt-1">Username is too long</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              placeholder="Enter your email"
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
              <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              placeholder="Enter your password"
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">Password should be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              placeholder="Confirm your password"
              {...register("confirm_password", {
                required: true,
                validate: (val) => val === watch("password") || "Passwords mismatch",
              })}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none"
            >
              Register Now
            </button>
          </div>
        </form>
        <hr className="my-4" />
        <div className="text-center">
          <p>
            Existing User? &nbsp; 
            <Link to="/auth/login" className="text-indigo-500 hover:underline">
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
