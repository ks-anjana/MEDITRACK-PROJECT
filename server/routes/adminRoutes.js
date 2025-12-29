const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createHealthTip,
  getHealthTips,
  seedHealthTips,
} = require('../controllers/adminController');

const router = express.Router();

// @route   POST /api/admin/seed-health-tips
// @desc    Seed default health tips (should be called once)
// @access  Public
router.post('/seed-health-tips', seedHealthTips);

// @route   GET /api/admin/health-tips
// @desc    Get all health tips (visible to all)
// @access  Public
router.get('/health-tips', getHealthTips);

// @route   POST /api/admin/health-tips
// @desc    Create a new health tip (Admin only)
// @access  Private/Admin
router.post('/health-tips', authMiddleware, adminMiddleware, createHealthTip);

module.exports = router;
