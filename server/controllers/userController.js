const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Feedback = require('../models/Feedback');
const HealthTip = require('../models/HealthTip');
const Advertisement = require('../models/Advertisement');
const fs = require('fs');

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all prescriptions and their files
    const prescriptions = await Prescription.find({ userId });
    prescriptions.forEach(prescription => {
      if (fs.existsSync(prescription.imagePath)) {
        fs.unlinkSync(prescription.imagePath);
      }
    });

    // Remove user's likes from all health tips
    // Only remove from likedBy array (likes count is derived from array length)
    await HealthTip.updateMany(
      { likedBy: userId },
      { 
        $pull: { likedBy: userId }
      }
    );

    // Delete all user data
    await Promise.all([
      Medicine.deleteMany({ userId }),
      Appointment.deleteMany({ userId }),
      Prescription.deleteMany({ userId }),
      Feedback.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const [userCount, tipsCount, adsCount, feedbackCount] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      HealthTip.countDocuments(),
      Advertisement.countDocuments(),
      Feedback.countDocuments()
    ]);

    const tips = await HealthTip.find().select('title likes');

    res.json({
      userCount,
      tipsCount,
      adsCount,
      feedbackCount,
      tips
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
