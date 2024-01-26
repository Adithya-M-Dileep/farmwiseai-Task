const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../utils/authentication');

// User registration
// only current management members can add new member who have access to change the data.
router.post('/register',authenticateToken, authController.registerUser);

// User Login
router.post('/login',authController.loginUser)
module.exports = router;
