const Appointment = require('../models/Appointment');

// Add appointment
exports.addAppointment = async (req, res) => {
  try {
    const { doctorName, appointmentDate, appointmentTime } = req.body;

    // Validation
    if (!doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorName,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
    });

    res.status(201).json({
      message: 'Saved Successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments for a user
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
