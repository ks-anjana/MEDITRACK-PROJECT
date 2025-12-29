const Medicine = require('../models/Medicine');

// Add medicine
exports.addMedicine = async (req, res) => {
  try {
    const { medicineName, time, period, foodTiming } = req.body;

    // Validation
    if (!medicineName || !time || !period || !foodTiming) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const medicine = await Medicine.create({
      userId: req.user.id,
      medicineName,
      time,
      period,
      foodTiming,
    });

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all medicines for a user
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id });

    res.status(200).json({
      medicines,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findByIdAndDelete(medicineId);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({
      message: 'Medicine removed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
