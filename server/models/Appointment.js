const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ SINGLE SOURCE OF TRUTH (UTC)
    appointmentAt: {
      type: Date,
      required: true,
      index: true,
    },

    alertSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
