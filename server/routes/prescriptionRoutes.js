const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const {
  uploadPrescription,
  getPrescriptions,
  deletePrescription,
} = require('../controllers/prescriptionController');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only JPG and PNG files
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/prescription/upload
// @desc    Upload a prescription image
// @access  Private
router.post('/upload', upload.single('prescription'), uploadPrescription);

// @route   GET /api/prescription
// @desc    Get all prescriptions for a user
// @access  Private
router.get('/', getPrescriptions);

// @route   DELETE /api/prescription/:prescriptionId
// @desc    Delete a prescription
// @access  Private
router.delete('/:prescriptionId', deletePrescription);

module.exports = router;
