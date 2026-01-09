const HealthTip = require('../models/HealthTip');
const User = require('../models/User');
const Ad = require('../models/Ad');

// Create health tip (Admin only)
exports.createHealthTip = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const healthTip = await HealthTip.create({
      title,
      content,
      createdBy: req.user._id,
      isAdmin: true,
      isPublished: false,
      likes: 0,
      likedBy: []
    });

    res.status(201).json({
      message: 'Health tip created successfully',
      healthTip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all health tips (For all users)
exports.getHealthTips = async (req, res) => {
  try {
    const healthTips = await HealthTip.find().sort({ createdAt: -1 });

    res.status(200).json({
      healthTips,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed default health tips
exports.seedDefaultHealthTips = async (req, res) => {
  try {
    // Check if health tips already exist
    const existingTips = await HealthTip.countDocuments();

    if (existingTips > 0) {
      return res.status(200).json({ message: 'Health tips already seeded' });
    }

    const defaultTips = [
      {
        title: 'Drink Plenty of Water',
        description:
          'Stay hydrated by drinking at least 8 glasses of water daily. Proper hydration helps maintain body temperature, transport nutrients, and remove waste.',
      },
      {
        title: 'Exercise Regularly',
        description:
          'Engage in at least 30 minutes of moderate physical activity daily. Regular exercise improves cardiovascular health, strengthens muscles, and boosts mental well-being.',
      },
      {
        title: 'Get Enough Sleep',
        description:
          'Aim for 7-9 hours of quality sleep each night. Good sleep is essential for immune function, cognitive performance, and emotional health.',
      },
      {
        title: 'Eat a Balanced Diet',
        description:
          'Include fruits, vegetables, whole grains, proteins, and healthy fats in your diet. A balanced diet provides essential nutrients for optimal health.',
      },
      {
        title: 'Manage Stress',
        description:
          'Practice relaxation techniques like meditation, deep breathing, or yoga. Stress management is crucial for mental and physical health.',
      },
    ];

    await HealthTip.insertMany(defaultTips);

    res.status(201).json({
      message: 'Health tips seeded successfully',
      count: defaultTips.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike health tip
exports.likeHealthTip = async (req, res) => {
  try {
    const { tipId } = req.params;
    const userId = req.user.id;

    const healthTip = await HealthTip.findById(tipId);

    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    // Check if user already liked
    const likedIndex = healthTip.likes.indexOf(userId);

    if (likedIndex > -1) {
      // Unlike
      healthTip.likes.splice(likedIndex, 1);
      await healthTip.save();
      return res.status(200).json({
        message: 'Health tip unliked',
        healthTip,
      });
    } else {
      // Like
      healthTip.likes.push(userId);
      await healthTip.save();
      return res.status(200).json({
        message: 'Health tip liked',
        healthTip,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user count (Admin only)
exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      userCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ad count (Admin only)
exports.getAdCount = async (req, res) => {
  try {
    const adCount = await Ad.countDocuments();

    res.status(200).json({
      adCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
