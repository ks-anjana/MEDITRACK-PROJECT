const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/roleMiddleware');
const {
  createHealthTip,
  getHealthTips,
  seedDefaultHealthTips,
  likeHealthTip,
  getUserCount,
  getAdCount,
} = require('../controllers/adminController');
const {
  createAd,
  getAds,
} = require('../controllers/adController');
const {
  getAllFeedback,
  replyToFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

// Health Tips Routes
// @route   POST /api/admin/seed-health-tips
// @desc    Seed default health tips (should be called once)
// @access  Public
router.post('/seed-health-tips', seedDefaultHealthTips);

// @route   GET /api/admin/health-tips
// @desc    Get all health tips (visible to all)
// @access  Public
router.get('/health-tips', getHealthTips);

// @route   POST /api/admin/health-tips
// @desc    Create a new health tip (Admin only)
// @access  Private/Admin
router.post('/health-tips', authMiddleware, adminMiddleware, createHealthTip);

// @route   POST /api/admin/health-tips/:tipId/like
// @desc    Like/Unlike a health tip
// @access  Private
router.post('/health-tips/:tipId/like', authMiddleware, likeHealthTip);

// Ad Routes
// @route   POST /api/admin/ads
// @desc    Create a new ad (Admin only)
// @access  Private/Admin
router.post('/ads', authMiddleware, adminMiddleware, createAd);

// @route   GET /api/admin/ads
// @desc    Get all ads
// @access  Public
router.get('/ads', getAds);

// Dashboard Stats Routes
// @route   GET /api/admin/stats/users
// @desc    Get user count (Admin only)
// @access  Private/Admin
router.get('/stats/users', authMiddleware, adminMiddleware, getUserCount);

// @route   GET /api/admin/stats/ads
// @desc    Get ad count (Admin only)
// @access  Private/Admin
router.get('/stats/ads', authMiddleware, adminMiddleware, getAdCount);

// Feedback Routes
// @route   GET /api/admin/feedback
// @desc    Get all feedback (Admin only)
// @access  Private/Admin
router.get('/feedback', authMiddleware, adminMiddleware, getAllFeedback);

// @route   PUT /api/admin/feedback/:feedbackId/reply
// @desc    Reply to feedback (Admin only)
// @access  Private/Admin
router.put('/feedback/:feedbackId/reply', authMiddleware, adminMiddleware, replyToFeedback);

module.exports = router;
