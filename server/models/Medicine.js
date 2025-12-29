const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicineName: {
    type: String,
    required: [true, 'Please provide medicine name'],
    trim: true,
  },
  time: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: [true, 'Please provide time'],
  },
  period: {
    type: String,
    enum: ['AM', 'PM'],
    required: [true, 'Please specify AM or PM'],
  },
  foodTiming: {
    type: String,
    enum: ['Before Food', 'After Food'],
    required: [true, 'Please specify food timing'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medicine', MedicineSchema);
