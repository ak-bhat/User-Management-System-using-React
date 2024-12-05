import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../utils/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((resp) => resp.json())
        .then((json) => {
            console.log("json"+json.message);
            if (!json.success) setError(json.message);
            else {
                dispatch(loginAdmin(json.data.token));
                navigate('/admin');
            }
        })
        .catch((err) => setError("Token error"+err.message));
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Hi Admin!</h2>
                {error && <h2 className="text-lg text-center text-red-600 mb-4">{error}</h2>}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            defaultValue="admin@gmail.com"
                            {...register("email", {
                                required: true,
                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            })}
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email?.type === 'required' && (
                            <p className="text-red-600 text-sm">Email is required</p>
                        )}
                        {errors.email?.type === 'pattern' && (
                            <p className="text-red-600 text-sm">Please enter a valid email</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            defaultValue="admin@123"
                            {...register("password", { required: true, minLength: 6 })}
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password?.type === 'required' && (
                            <p className="text-red-600 text-sm">Password is required</p>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <p className="text-red-600 text-sm">Password must be at least 6 characters</p>
                        )}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Login Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
