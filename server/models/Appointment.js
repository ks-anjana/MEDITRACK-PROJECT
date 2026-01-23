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

    // ✅ Store date in ISO format (YYYY-MM-DD)
    appointmentDate: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date must be in YYYY-MM-DD format'
      }
    },

    // ✅ Store time in 12-hour format with AM/PM (e.g., "10:30 AM")
    appointmentTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(v);
        },
        message: 'Time must be in format HH:MM AM/PM'
      }
    },

    // ✅ Store combined UTC date for easy sorting/filtering
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
