const express = require('express');
const router = express.Router();
const { addAppointment, getAppointments, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { getAppointmentAlerts } = require('../utils/cronJobs');

// Appointment CRUD routes
router.post('/', protect, addAppointment);
router.get('/', protect, getAppointments);
router.delete('/:id', protect, deleteAppointment);

// Get appointment alerts for current user
router.get('/alerts/check', protect, (req, res) => {
  try {
    const alerts = getAppointmentAlerts(req.user._id.toString());
    console.log(`📱 Alert check for user ${req.user._id}: ${alerts.length} alert(s)`);
    res.json({ alerts });
  } catch (error) {
    console.error('Error getting appointment alerts:', error);
    res.status(500).json({ message: error.message, alerts: [] });
  }
});

module.exports = router;
