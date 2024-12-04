const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

//Admin Login
const loginAdmin = async (req,res) =>{
    try {

        if (req.body.email !== process.env.ADMIN_EMAIL) {
            throw new Error("Invalid Credentials");
        }

        let comparePassword = bcrypt.compare(req.body.password, process.env.ADMIN_PASSWORD);

        if (!comparePassword) {
            throw new Error("Invalid Credentials");
        }else{
            const accesToken = jwt.sign({email:req.body.email}, process.env.ADMIN_JWT_SECRET, {expiresIn:'10'})
            return res.json({success:true, message:"Admin LoggedIn Successfully", data:{token:accesToken}})
        }
        
    } catch (error) {
        console.log(error);
        return res.json({success:false, status_code:401, message:error.message, data:{}})
    }
}

//Admin side - add New User
const addNewUser = async (req, res, next) => {
    try {
        const {username, email, password, confirmPassword} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {

            throw new Error("User Already Exists");

        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            delete confirmPassword;
            const newUser = new User({username, email, password:hashPassword})
            await newUser.save();
            return res.status(201).json({success:true, message:"Added new User", data:{_id:newUser._id, username:newUser.username, email:newUser.email}})
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false, status_code:400, message:error.message, data:{}})
    }
}


//Admin- Update User
const updateExistingUser = async (req, res, next) => {
    try {

        const userId = req.params.id;
        const existingUser = await User.findOne({_id:userId});

        if (!existingUser) {

            throw new Error("User not found");

        } else {
            const updatedUser = await User.updateOne({_id:userId}, {$set:{...req.body}}) // Collects only updated data -  $set
            return res.status(200).json({success:true, message:"User updated", data:{username: updatedUser.username, email: updatedUser.email}});
        }

    } catch (error) {
        return res.status(404).json({success:false, status_code:400, message:error.message, data:{}})
    }
}

// Delete existing user
const deleteExitingUser = async (req, res, next) =>{
    try {
        const userId = req.params.id;
        const resp = await User.deleteOne({_id:userId});

        if (resp.acknowledged == true && resp.deletedCount == 1) {
            return res.status(201).json({ success:true, message:"User deleted", data:{} });
        } else {
            throw new Error("User not found")
        }
    } catch (error) {
        return res.status(400).json({success:false, status_code:400,message:error.message, data:{} })
    }
}


module.exports = {
    loginAdmin,
    addNewUser,
    updateExistingUser,
    deleteExitingUser
}