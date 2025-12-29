const mongoose = require('mongoose');

const HealthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthTip', HealthTipSchema);
