const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* ===========================
   Generate JWT Token
   =========================== */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/* ===========================
   Register User
   =========================== */
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body; // allow role (default 'user')

    console.log('📝 Registration attempt:', { name, email, role });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: (email || '').toLowerCase() });
    if (existingUser) {
      // Spec requires 409 with exact message
      return res.status(409).json({
        message: 'User already registered',
      });
    }

    // Sanitize role
    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    // Create user
    const created = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: normalizedRole,
    });

    console.log('✅ User registered successfully:', created.email);

    // No auto-login
    return res.status(201).json({
      message: 'Registration successful! Please login to continue.',
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({
      message: error.message || 'Server error during registration',
    });
  }
};

/* ===========================
   Login User
   =========================== */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 Login attempt:', { email, requestedRole: role });

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await User.findOne({ email: (email || '').toLowerCase() });

    // Spec: if email does not exist → 401 'Invalid email or password'
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Password check
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('❌ Invalid password for:', email);
      // Spec: 401 with same message
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Role-based login restriction per spec
    if (role && user.role !== role) {
      if (role === 'admin' && user.role === 'user') {
        return res.status(403).json({
          message: 'User cannot login here',
        });
      }
      if (role === 'user' && user.role === 'admin') {
        return res.status(403).json({
          message: 'Admin cannot login here',
        });
      }
    }

    console.log('✅ User logged in successfully:', email);

    return res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      message: error.message || 'Server error during login',
    });
  }
};

/* ===========================
   Get User Profile
   =========================== */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   Delete User Account
   =========================== */
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Remove likes from health tips
    const HealthTip = require('../models/HealthTip');
    await HealthTip.updateMany(
      { likedBy: userId },
      { $pull: { likedBy: userId } }
    );

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   Exports
   =========================== */
module.exports = {
  register,
  login,
  getUserProfile,
  deleteUserAccount,
};
