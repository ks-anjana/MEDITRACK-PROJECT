const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
