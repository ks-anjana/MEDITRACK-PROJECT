const Appointment = require('../models/Appointment');

// Add appointment - FIX VALIDATION
exports.addAppointment = async (req, res) => {
  try {
    const { doctorName, hospitalName, appointmentDate, appointmentTime } = req.body;

    // Check all fields explicitly
    if (!doctorName || doctorName.trim() === '') {
      return res.status(400).json({ message: 'Please provide doctor name' });
    }

    if (!hospitalName || hospitalName.trim() === '') {
      return res.status(400).json({ message: 'Please provide hospital name' });
    }

    if (!appointmentDate || appointmentDate.trim() === '') {
      return res.status(400).json({ message: 'Please provide appointment date' });
    }

    if (!appointmentTime || appointmentTime.trim() === '') {
      return res.status(400).json({ message: 'Please provide appointment time' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorName: doctorName.trim(),
      hospitalName: hospitalName.trim(),
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim()
    });

    res.status(201).json({
      message: 'Appointment added successfully',
      appointment
    });
  } catch (error) {
    console.error('Add appointment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Appointment deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: error.message });
  }
};
