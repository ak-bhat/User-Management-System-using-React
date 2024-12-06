const jwt = require("jsonwebtoken");

const userAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];

    if (!token) {
      throw new Error("Authorization failed!!!");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    req.userName = verified.username;
    next();

  } catch (error) {
      console.log(error);
      
        return res.status(401).json({success:false, message:error.message, error_code:404, data:{}})
  }
};

module.exports = {
    userAuthMiddleware
}