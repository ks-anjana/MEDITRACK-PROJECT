const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
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
    type: String,
    required: [true, 'Please provide time'],
    trim: true,
  },
  foodTiming: {
    type: String,
    enum: ['before food', 'after food'],
    required: [true, 'Please provide food timing'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medicine', medicineSchema);
