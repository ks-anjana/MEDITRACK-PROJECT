const Medicine = require('../models/Medicine');

// Add medicine
exports.addMedicine = async (req, res) => {
  try {
    const { medicineName, reminderAt, foodTiming, repeatDaily } = req.body;

    // Validation
    if (!medicineName || !reminderAt || !foodTiming) {
      return res.status(400).json({
        message: 'Fields required: medicineName, reminderAt, foodTiming'
      });
    }

    // Validate enum
    if (!['before food', 'after food'].includes(foodTiming)) {
      return res.status(400).json({
        message: 'Food timing must be either "before food" or "after food"'
      });
    }

    // Convert to JS date
    const timestamp = new Date(reminderAt);
    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ message: 'Invalid reminderAt timestamp' });
    }

    const medicine = await Medicine.create({
      userId: req.user._id,
      medicineName: medicineName.trim(),
      foodTiming,
      reminderAt: timestamp,
      repeatDaily: repeatDaily ?? true // default true
    });

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine
    });

  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id })
      .sort({ reminderAt: 1 });

    res.json(medicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Ownership check
    if (medicine.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this medicine' });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Medicine deleted successfully',
      id: req.params.id
    });

  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({ message: error.message });
  }
};
