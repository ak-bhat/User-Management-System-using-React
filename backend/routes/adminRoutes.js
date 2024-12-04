const {adminAuthMiddleware} = require('../middlewares/adminAuthMiddleware')
const {
    loginAdmin,
    addNewUser,
    updateExistingUser,
    deleteExitingUser,
    getAllUsers,
    getSingleUser
} = require('../controllers/adminController');

const router = require('express').Router();

router.post('/login', loginAdmin);

router.post('/add-new-user', adminAuthMiddleware, addNewUser);

router.post('/update-user-details/:id', adminAuthMiddleware, updateExistingUser);

router.delete('/delete-user/:id', adminAuthMiddleware, deleteExitingUser);

router.get('/all-users', adminAuthMiddleware, getAllUsers);

router.get('/get-user/:id', adminAuthMiddleware, getSingleUser);

module.exports =router;