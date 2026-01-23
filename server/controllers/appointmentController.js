const Appointment = require('../models/Appointment');

/**
 * ADD APPOINTMENT
 * Frontend sends:
 *  appointmentDate: "2026-01-18" (YYYY-MM-DD)
 *  appointmentTime: "11:28 AM" (HH:MM AM/PM)
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

    // ===== VALIDATE DATE FORMAT (YYYY-MM-DD) =====
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // ===== VALIDATE TIME FORMAT (HH:MM AM/PM) =====
    const timeRegex = /^\d{1,2}:\d{2}\s?(AM|PM)$/i;
    if (!timeRegex.test(appointmentTime.trim())) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM AM/PM' });
    }

    // ===== VALIDATE DATE IS VALID =====
    const dateObj = new Date(appointmentDate + ' ' + appointmentTime);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time provided' });
    }

    // ===== CHECK DATE IS NOT IN THE PAST =====
    const now = new Date();
    if (dateObj < now) {
      return res.status(400).json({ message: 'Cannot schedule appointment in the past' });
    }

    // ===== SAVE APPOINTMENT =====
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorName: doctorName.trim(),
      hospitalName: hospitalName.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      appointmentAt: dateObj,  // Combined date for sorting
      alertSent: false,
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
