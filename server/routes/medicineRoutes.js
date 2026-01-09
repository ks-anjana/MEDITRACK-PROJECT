const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  addMedicine,
  getUserMedicines,
  deleteMedicine,
} = require('../controllers/medicineController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/medicine
// @desc    Add a new medicine
// @access  Private
router.post('/', addMedicine);

// @route   GET /api/medicine
// @desc    Get all medicines for a user
// @access  Private
router.get('/', getUserMedicines);

// @route   DELETE /api/medicine/:medicineId
// @desc    Delete a medicine
// @access  Private
router.delete('/:medicineId', deleteMedicine);

module.exports = router;
