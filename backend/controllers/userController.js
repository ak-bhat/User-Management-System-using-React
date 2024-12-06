const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

//Register a User
const registerUser = async (req,res) => {
    try {
        const {username, email, password, confirmPassword} = req.body;
        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new Error("User Already Exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userObj = new User({username, email, password:hashedPassword});
            delete userObj.confirmPassword;
            let newUser = await userObj.save();    //Save new user to db

            const accessToken = jwt.sign({username:newUser, userId:newUser._id}, process.env.JWT_SECRET, {expiresIn:'15m'})  // Create access token for user
            res.json({success:true, message:"User signup successfull", data:{username:newUser.username, userId: newUser._id, token:accessToken}})  //send success response on user login 
        }
    } catch (error) {
        return res.json({success:false, message:error.message, data:{} });
    }
}

//Login user
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const userDetails = await User.findOne({email});

        if (!userDetails) {
            throw new Error("Invalid Credentials");
        } else {
            const passwordResp = await bcrypt.compare(password, userDetails?.password);

            if (!passwordResp) {
                throw new Error("Invalid Credentials");
                
            } else {
                const accessToken = jwt.sign({username:userDetails.username, userId:userDetails._id}, process.env.JWT_SECRET, {expiresIn:'15m'})  // Create access token for user
                res.json({success:true, message:"User signup successfull", data:{username:userDetails.username, userId: userDetails._id, token:accessToken}})  //send success response on user login 
            }
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message, data:{}}) 
    }
}


// Get User Details

const getProfileDetails = async (req, res) => {
    try {
        const userId = req.userId
        console.log(userId);
        
        const user = await User.findOne({_id:userId})
        return res.status(200).json({success:true, message:"User Data Fetched", data:{user}})
    } catch (error) {
        return res.status(401).json({success:false, message:error.message, data:{}})
    }
}


// Upload Image

const uploadImage = async (req, res) => {
    try {
        // console.log(req.body.file);
        
        if(!req.body){
            return res.status(204).json({success:false, error_code:204, message:"No file to upload", data:{}})
        }

        //upload to cloud

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,            // Config cloud setup
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        cloudinary.uploader.upload(req.body.file,
            {folder:"USER_MANAGEMENT"},   //Create folder in cloud
            async function(error, result) {
                if(error){
                    throw new Error(error);
                } else {
                    // console.log(result);
                    await User.updateOne({_id:req.userID}, {$set:{profile_pic:result.secure_url}});   // Update the user info with image url
                    return res.status(201).json({success:true, message:"Profile picture updated", data:{imageURL: result.secure_url} })
                }
                
            }
        )


    } catch (error) {
        console.log("img-upload error",error.message);
        return res.status(500).json({ success:false, error_code:500, message:error.message, data:{} })
    }
}


module.exports = {
    registerUser,
    loginUser,
    getProfileDetails,
    uploadImage,
}