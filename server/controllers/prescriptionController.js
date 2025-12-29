const Prescription = require('../models/Prescription');
const fs = require('fs');
const path = require('path');

// Upload prescription
exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const prescription = await Prescription.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: 'Prescription uploaded successfully',
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all prescriptions for a user
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id });

    res.status(200).json({
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findByIdAndDelete(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Delete file from storage
    if (fs.existsSync(prescription.filePath)) {
      fs.unlinkSync(prescription.filePath);
    }

    res.status(200).json({
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
