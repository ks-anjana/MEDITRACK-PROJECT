const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  redirectUrl: {
    type: String,
    required: [true, 'Please provide redirect URL'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ad', AdSchema);
