const jwt = require('jsonwebtoken');


const adminAuthMiddleware = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split('')[1]; // Authorization: 'Bearer TOKEN'
        //req.headers.authorization: Retrieves the Authorization header from the incoming request .split(' '): Splits the string into an array where each word is separated by a space.[1]: Gets the second element (index 1) of the resulting array, which is the token.

        if(!token){
            throw new Error("Authentication Failed!!!");
        }
        const verified = jwt.verify(token, process.env.ADMIN_JWT_SECRET)   //Compares with our token
        req.adminEmail = verified.email;      //email from payload (verified) to the req object. This makes the email accessible in subsequent middleware or route handlers
        next();
    } catch (error) {
        return res.status(401).json({success:false, message:error.message, error_code:404, data:{}})
    }
}

module.exports = {
    adminAuthMiddleware
}