const express = require('express');
const router = express.Router();

// Import controller functions
let register, login, deleteUserAccount, authMiddleware;

try {
  const authController = require('../controllers/authController');
  register = authController.register;
  login = authController.login;
  deleteUserAccount = authController.deleteUserAccount;
  
  console.log('✅ Auth controller functions loaded:', {
    register: typeof register,
    login: typeof login,
    deleteUserAccount: typeof deleteUserAccount
  });
} catch (error) {
  console.error('❌ Failed to load auth controller:', error.message);
  console.error('   Full path attempted:', require.resolve('../controllers/authController'));
}

try {
  authMiddleware = require('../middleware/authMiddleware');
  console.log('✅ Auth middleware loaded');
} catch (error) {
  console.error('⚠️  Auth middleware not available:', error.message);
  // Fallback middleware
  authMiddleware = (req, res, next) => {
    res.status(500).json({ message: 'Auth middleware not configured' });
  };
}

// Test route
router.get('/test', (req, res) => {
  console.log('🧪 Auth test route hit');
  res.json({ 
    message: 'Auth routes working',
    timestamp: new Date().toISOString(),
    controllersLoaded: {
      register: typeof register === 'function',
      login: typeof login === 'function'
    }
  });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res, next) => {
  console.log('📨 POST /api/auth/register hit');
  if (typeof register === 'function') {
    register(req, res, next);
  } else {
    res.status(500).json({ message: 'Register function not loaded' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res, next) => {
  console.log('📨 POST /api/auth/login hit');
  if (typeof login === 'function') {
    login(req, res, next);
  } else {
    res.status(500).json({ message: 'Login function not loaded' });
  }
});

// @route   DELETE /api/auth/delete-account
// @desc    Delete user account and all related data
// @access  Private
router.delete('/delete-account', authMiddleware, (req, res, next) => {
  console.log('📨 DELETE /api/auth/delete-account hit');
  if (typeof deleteUserAccount === 'function') {
    deleteUserAccount(req, res, next);
  } else {
    res.status(500).json({ message: 'Delete account function not loaded' });
  }
});

console.log('📋 Auth routes module exported');

module.exports = router;
