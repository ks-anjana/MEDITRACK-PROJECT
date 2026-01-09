const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  addFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Private
router.post('/', addFeedback);

module.exports = router;
