const express = require('express');
const router = express.Router();
const { getAdvertisements, addAdvertisement, deleteAdvertisement } = require('../controllers/advertisementController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

router.get('/', protect, getAdvertisements);
router.post('/', protect, adminOnly, addAdvertisement);
router.delete('/:id', protect, adminOnly, deleteAdvertisement);

module.exports = router;
