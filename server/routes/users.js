const express = require('express');
const router = express.Router();
const { deleteAccount, getAdminStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

router.delete('/me', protect, deleteAccount);
router.get('/admin/stats', protect, adminOnly, getAdminStats);

module.exports = router;
