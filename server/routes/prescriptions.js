const express = require('express');
const router = express.Router();
const { upload, uploadPrescription, getPrescriptions, deletePrescription } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('prescription'), uploadPrescription);
router.get('/', protect, getPrescriptions);
router.delete('/:id', protect, deletePrescription);

module.exports = router;
