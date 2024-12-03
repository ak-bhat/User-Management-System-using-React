const mongoose = require('mongoose') // Import mongoose library

const userSchema = new mongoose.Schema(   // Used to create Schema 
    {
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        profile_pic: {type:String, default: null}
    },
    {timestamps:true}
);

module.exports = mongoose.model("User", userSchema);