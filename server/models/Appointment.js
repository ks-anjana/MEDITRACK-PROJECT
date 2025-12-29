const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date'],
  },
  appointmentTime: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: [true, 'Please provide appointment time'],
  },
  alertSent: {
    type: Boolean,
    default: false, // Track if appointment day alert was sent
  },
  previousDayAlertSent: {
    type: Boolean,
    default: false, // Track if previous day alert was sent
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
