const Appointment = require('../models/Appointment');

/**
 * ADD APPOINTMENT (UTC SAFE)
 * Frontend sends:
 *  appointmentDate: "2026-01-18"
 *  appointmentTime: "11:28 AM"
 */
exports.addAppointment = async (req, res) => {
  try {
    const {
      doctorName,
      hospitalName,
      appointmentDate,
      appointmentTime,
    } = req.body;

    // ===== VALIDATION =====
    if (!doctorName?.trim()) {
      return res.status(400).json({ message: 'Please provide doctor name' });
    }

    if (!hospitalName?.trim()) {
      return res.status(400).json({ message: 'Please provide hospital name' });
    }

    if (!appointmentDate?.trim()) {
      return res.status(400).json({ message: 'Please provide appointment date' });
    }

    if (!appointmentTime?.trim()) {
      return res.status(400).json({ message: 'Please provide appointment time' });
    }

    // ===== CONVERT LOCAL TIME → UTC DATE =====
    const localDateTime = new Date(`${appointmentDate} ${appointmentTime}`);

    if (isNaN(localDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }

    const appointmentAt = new Date(
      localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000
    );

    // ===== SAVE APPOINTMENT =====
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorName: doctorName.trim(),
      hospitalName: hospitalName.trim(),
      appointmentAt,       // ✅ UTC date
      alertSent: false,    // ✅ alert flag
    });

    res.status(201).json({
      message: 'Appointment added successfully',
      appointment,
    });
  } catch (error) {
    console.error('Add appointment error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER APPOINTMENTS
 */
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user._id,
    }).sort({ appointmentAt: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE APPOINTMENT
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Appointment deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * CHECK APPOINTMENT ALERTS (USED BY FRONTEND POLLING)
 * Endpoint: GET /api/appointments/alerts/check
 */
exports.checkAppointmentAlerts = async (req, res) => {
  try {
    const now = new Date(); // UTC-safe

    const appointments = await Appointment.find({
      userId: req.user._id,
      appointmentAt: { $lte: now },
      alertSent: false,
    });

    // Mark alerts as sent (avoid duplicates)
    if (appointments.length > 0) {
      await Appointment.updateMany(
        { _id: { $in: appointments.map(a => a._id) } },
        { alertSent: true }
      );
    }

    res.json(appointments);
  } catch (error) {
    console.error('Check appointment alerts error:', error);
    res.status(500).json({ message: error.message });
  }
};
