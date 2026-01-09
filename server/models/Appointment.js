const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  hospitalName: {
    type: String,
    required: [true, 'Please provide hospital name'],
    trim: true,
  },
  appointmentDate: {
    type: String,
    required: [true, 'Please provide appointment date'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
