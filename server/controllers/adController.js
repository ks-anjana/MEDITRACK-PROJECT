const Ad = require('../models/Ad');

// Create ad (Admin only)
exports.createAd = async (req, res) => {
  try {
    const { title, description, redirectUrl } = req.body;

    // Validation
    if (!title || !description || !redirectUrl) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const ad = await Ad.create({
      title,
      description,
      redirectUrl,
    });

    res.status(201).json({
      message: 'Ad created successfully',
      ad,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ads
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });

    res.status(200).json({
      ads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
