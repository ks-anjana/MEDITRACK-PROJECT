const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, replyToFeedback, deleteReply, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// User routes
router.post('/', protect, submitFeedback);
router.get('/', protect, getAllFeedback);
router.delete('/:id', protect, deleteFeedback); // Allow user to delete their own feedback

// Admin only routes
router.post('/:id/reply', protect, adminOnly, replyToFeedback);
router.delete('/:id/reply', protect, adminOnly, deleteReply);

module.exports = router;
