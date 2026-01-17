const Prescription = require('../models/Prescription');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ================================
   CREATE UPLOADS DIRECTORY
================================ */
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================================
   MULTER STORAGE CONFIG
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'prescription-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

/* ================================
   FILE FILTER
================================ */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only image files are allowed (jpeg, jpg, png, gif, webp)'
      )
    );
  }
};

/* ================================
   MULTER EXPORT
================================ */
exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

/* ================================
   UPLOAD PRESCRIPTION
================================ */
exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload an image file'
      });
    }

    // ✅ FIXED: no localhost, no http
    const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const prescription = await Prescription.create({
      userId: req.user._id,
      imagePath: req.file.path,
      imageUrl
    });

    res.status(201).json({
      message: 'Prescription uploaded successfully',
      prescription
    });
  } catch (error) {
    console.error('Upload prescription error:', error);

    // Cleanup file if DB fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET USER PRESCRIPTIONS
================================ */
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE PRESCRIPTION
================================ */
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found'
      });
    }

    // Ownership check
    if (prescription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this prescription'
      });
    }

    // Delete image file
    if (
      prescription.imagePath &&
      fs.existsSync(prescription.imagePath)
    ) {
      fs.unlinkSync(prescription.imagePath);
    }

    await Prescription.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Prescription deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: error.message });
  }
};
