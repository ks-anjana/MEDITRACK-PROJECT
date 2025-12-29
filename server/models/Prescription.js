const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: [true, 'Please provide file name'],
  },
  filePath: {
    type: String,
    required: [true, 'Please provide file path'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
