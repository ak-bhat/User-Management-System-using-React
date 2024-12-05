import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../utils/adminSlice";
import useGetUserDetails from "../../hooks/useGetUserDetails";

const AdminUpdateUser = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { id } = useParams();
  console.log("paramsID", id);
  const userDetails = useGetUserDetails(id);
  const adminToken = useSelector((store) => store.admin.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("Submitted Data:", data);
      const response = await fetch(
        `${process.env.BACKEND_ADMIN_BASE_URL}/update-user-details/${id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 401) {
        dispatch(logoutAdmin(null));
        return;
      }

      const jsonData = await response.json();
      if (jsonData.success) {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-lg p-8 bg-white rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          ✒️ Edit User
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              placeholder={userDetails?.username}
              {...register("username", { required: true, minLength: 4, maxLength: 15 })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">Username is required</p>
            )}
            {errors.username?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-1">
                Username should have at least 4 characters
              </p>
            )}
            {errors.username?.type === "maxLength" && (
              <p className="text-red-500 text-xs mt-1">Username is too long</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              placeholder={userDetails?.email}
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              })}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              noValidate
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

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none"
            >
              Change Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateUser;
