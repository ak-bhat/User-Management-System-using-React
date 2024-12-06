import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, setUserProfilePic } from '../../utils/userSlice';
import useLoginUser from '../../hooks/useLoginUser';

// Function to convert an image to a Base64 string
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const UserProfile = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const { user, error } = useLoginUser();
    const [imageError, setImageError] = useState(null);

    const USER_DEFAULT_IMAGE = 'https://th.bing.com/th/id/OIP.wRBGXNn1WOjghttSJbyxKwHaHa?w=600&h=600&rs=1&pid=ImgDetMain';
    const userToken = useSelector(store => store.user.userToken);
    const user1 = useSelector(store => store?.user);
    const userDP = useSelector(store => store?.user?.userProflePic) ?? USER_DEFAULT_IMAGE;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log("token "+userToken);
    
    // user profile pic upload form
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        try {
            if (!data.image[0]) {
                console.log("No image found");
                throw new Error("No image Found");
            }
            // console.log('Form data:', data.image[0]);
            const base64Image = await fileToBase64(data.image[0]);
            // console.log(base64Image);

            const response = await fetch("http://localhost:5000/api/user/upload-profile_pic", {
                method: 'POST',
                body: JSON.stringify({ file: base64Image }),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${userToken}`,
                },
            });
            console.log("response "+ response.status);
            
            if (response.status === 401) {
                dispatch(logoutUser());
                navigate('/auth/login');
            }
            const jsonData = await response.json();
            console.log("json image"+jsonData.data.imageURL);
            if (!jsonData.success) {
                setImageError(jsonData.message);
            } else {
                dispatch(setUserProfilePic(jsonData.data.imageURL));
            }
        } catch (error) {
            setImageError(error.message);
        }
    };

    // user profile image preview
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    };

    if (!user && error) return;

    return (
        <>
            {/* user profile card */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center">
                    <div className="card w-96 shadow-xl">
                        <div className="card-body">
                            <div className="flex text-black">
                                <div className="flex-shrink-0">
                                    <img
                                        src={userDP}
                                        alt="Profile"
                                        className="w-44 h-44 rounded-lg"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-xl font-semibold">{user1?.username}</h5>
                                    {/* <p className="text-gray-600">{user1?.email}</p>
                                    <p className="text-gray-500">Joined on: {user1?.createdAt}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* user profile image update card */}
            <div className="container my-6">
                <div className="flex justify-center">
                    <div className="card w-96 shadow-xl">
                        <div className="card-body">
                            <h5 className="text-center text-xl mb-4">Update Profile Pic</h5>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* Display image preview */}
                                {previewUrl && (
                                    <div className="text-center mb-4">
                                        <img
                                            src={previewUrl}
                                            alt="Selected profile preview"
                                            className="w-48 h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Image field */}
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        {...register('image')}
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {imageError && <p className="text-center text-red-500">{imageError}</p>}

                                {/* Submit button */}
                                <div className="d-grid">
                                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                                        Update Profile Pic
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
