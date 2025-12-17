const express = require('express');
const router = express.Router(); // Create a new router object
const userController = require('../controller/Usercontroller'); // Import user controller

// POST endpoint for user registration
// Calls the registerStudent function from the user controller
router.post('/register', userController.registerStudent);

// POST endpoint for user login
// Calls the loginStudent function from the user controller
router.post('/login', userController.loginStudent);

module.exports = router;
