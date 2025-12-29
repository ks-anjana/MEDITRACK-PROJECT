const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  addAppointment,
  getAppointments,
  deleteAppointment,
} = require('../controllers/appointmentController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/appointment
// @desc    Add a new appointment
// @access  Private
router.post('/', addAppointment);

// @route   GET /api/appointment
// @desc    Get all appointments for a user
// @access  Private
router.get('/', getAppointments);

// @route   DELETE /api/appointment/:appointmentId
// @desc    Delete an appointment
// @access  Private
router.delete('/:appointmentId', deleteAppointment);

module.exports = router;
