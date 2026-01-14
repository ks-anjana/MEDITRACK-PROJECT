const Advertisement = require('../models/Advertisement');
const User = require('../models/User.js');

// Get all advertisements
exports.getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(ads);
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add advertisement (admin only)
exports.addAdvertisement = async (req, res) => {
  try {
    const { title, image, redirectUrl } = req.body;

    if (!title || !image || !redirectUrl) {
      return res.status(400).json({ message: 'Please provide title, image, and redirect URL' });
    }

    // Check if there are any users in the system
    const User = require('../models/User.js');
    const userCount = await User.countDocuments({ role: 'user' });
    
    if (userCount === 0) {
      return res.status(400).json({ message: 'No users found' });
    }

    const ad = await Advertisement.create({
      title: title.trim(),
      image: image.trim(),
      redirectUrl: redirectUrl.trim(),
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Advertisement added successfully',
      ad
    });
  } catch (error) {
    console.error('Add advertisement error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete advertisement (admin only)
exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Advertisement deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({ message: error.message });
  }
};
