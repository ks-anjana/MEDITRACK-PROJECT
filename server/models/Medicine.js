const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  medicineName: {
    type: String,
    required: true,
    trim: true,
  },

  foodTiming: {
    type: String,
    enum: ['before food', 'after food'],
    required: true,
  },

  // 🔥 NEW: Full timestamp instead of string time
  reminderAt: {
    type: Date,
    required: true,
  },

  // 🔄 NEW: Repeat every day (optional)
  repeatDaily: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medicine', medicineSchema);
