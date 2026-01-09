const express = require('express');
const router = express.Router();
const { 
  getHealthTips, 
  addHealthTip, 
  updateHealthTip, 
  likeHealthTip,
  deleteHealthTip,
  sendTipsToUsers
} = require('../controllers/healthTipController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// Public/User routes
router.get('/', protect, getHealthTips);
router.post('/:id/like', protect, likeHealthTip);

// Admin only routes
router.post('/', protect, adminOnly, addHealthTip);
router.put('/:id', protect, adminOnly, updateHealthTip);
router.delete('/:id', protect, adminOnly, deleteHealthTip);
router.post('/send/users', protect, adminOnly, sendTipsToUsers);

module.exports = router;
