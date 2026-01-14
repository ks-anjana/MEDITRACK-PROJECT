const express = require('express');
const router = express.Router();
const { registerToken, sendPush } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.post('/token', protect, registerToken);
router.post('/send', protect, sendPush);

module.exports = router;
