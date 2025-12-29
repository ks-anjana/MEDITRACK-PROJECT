const HealthTip = require('../models/HealthTip');

// Create health tip (Admin only)
exports.createHealthTip = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const healthTip = await HealthTip.create({
      title,
      description,
    });

    res.status(201).json({
      message: 'Post Completed',
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
exports.seedHealthTips = async (req, res) => {
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
