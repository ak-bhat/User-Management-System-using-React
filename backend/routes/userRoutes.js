const {
    registerUser,
    loginUser,
    getProfileDetails,
    uploadImage,
} = require('../controllers/userController');

const {userAuthMiddleware} = require('../middlewares/userAuthMiddleware');

const router = require('express').Router();

router.post('/login', loginUser);

router.post('/signup', registerUser);

router.get('/get-user', userAuthMiddleware, getProfileDetails);

router.post('/upload-propic', userAuthMiddleware, uploadImage);

module.exports = router;