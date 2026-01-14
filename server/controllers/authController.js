const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Registration attempt:', { name, email });

    // Validation
    if (!name || !email ||!password) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Account already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
    });

    console.log('✅ User registered successfully:', user.email);

    // Return success message ONLY (no token, no auto-login)
    res.status(201).json({
      message: 'Registration successful! Please login to continue.',
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      message: error.message || 'Server error during registration',
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 Login attempt:', { email, requestedRole: role });

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Account does not exist' });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ROLE VALIDATION: Enforce role-based login restriction
    if (role && user.role !== role) {
      if (role === 'admin') {
        console.log('❌ User account cannot login from Admin Login:', email);
        return res.status(403).json({ message: 'This account does not have admin access' });
      } else if (role === 'user') {
        console.log('❌ Admin account cannot login from User Login:', email);
        return res.status(403).json({ message: 'Admin accounts must login from Admin Login page' });
      }
    }

    console.log('✅ User logged in successfully:', email, '- Role:', user.role);

    // Return token and user info
    res.json({
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
    res.status(500).json({
      message: error.message || 'Server error during login',
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user's likes from all health tips
    // Only remove from likedBy array (likes count is derived from array length)
    const HealthTip = require('../models/HealthTip');
    await HealthTip.updateMany(
      { likedBy: userId },
      { 
        $pull: { likedBy: userId }
      }
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export functions with correct names
module.exports = {
  register,
  login,
  getUserProfile,
  deleteUserAccount,
};
