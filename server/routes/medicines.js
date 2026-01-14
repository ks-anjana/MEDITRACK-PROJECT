const express = require('express');
const router = express.Router();
const { addMedicine, getMedicines, deleteMedicine } = require('../controllers/medicineController');
const auth = require("../middleware/auth.js");
const { getMedicineAlerts } = require('../utils/cronJobs');

// Medicine CRUD routes
router.post('/', protect, addMedicine);
router.get('/', protect, getMedicines);
router.delete('/:id', protect, deleteMedicine);

// Get medicine alerts for current user
router.get('/alerts/check', protect, (req, res) => {
  try {
    const alerts = getMedicineAlerts(req.user._id.toString());
    console.log(`📱 Alert check for user ${req.user._id}: ${alerts.length} alert(s)`);
    res.json({ alerts });
  } catch (error) {
    console.error('Error getting medicine alerts:', error);
    res.status(500).json({ message: error.message, alerts: [] });
  }
});

module.exports = router;
