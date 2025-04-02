const express = require('express');
const router = express.Router();
const {uploadProfileImage} = require('../middleware/multer');
const userController = require('../controller/userController');
const { registerValidator, loginValidator } = require('../validator/userValidator');
 
router.post('/user/register', registerValidator, userController.registerUser);
router.post('/user/login', loginValidator, userController.loginUser);
router.get('/user/all', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.put('/user/update/:id',uploadProfileImage, userController.updateUser);
router.delete('/user/delete/:id', userController.deleteUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
module.exports = router;