const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Public routes → used for user authentication
router.post('/register', register); // create new user
router.post('/login', login); // authenticate user and return token

module.exports = router;