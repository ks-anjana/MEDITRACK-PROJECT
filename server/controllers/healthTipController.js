const HealthTip = require('../models/HealthTip');

// Get all health tips
exports.getHealthTips = async (req, res) => {
  try {
    const isAdminUser = req.user && req.user.role === 'admin';
    // Admin sees all tips, users only see published tips (regardless of isDefault)
    const query = isAdminUser ? {} : { isPublished: true };

    const tips = await HealthTip.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    // Transform tips to derive likes from likedBy.length
    const tipsWithLikes = tips.map(tip => ({
      ...tip.toObject(),
      likes: tip.likedBy.length
    }));

    if (isAdminUser) {
      console.log(`✅ Fetched ${tipsWithLikes.length} health tips for admin`);
    } else {
      console.log(`✅ Published tips shown to users: ${tipsWithLikes.length}`);
    }

    res.json(tipsWithLikes);
  } catch (error) {
    console.error('❌ Error fetching health tips:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add health tip (admin only)
exports.addHealthTip = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const tip = await HealthTip.create({
      title: title.trim(),
      content: content.trim(),
      createdBy: req.user._id,
      isAdmin: true,
      isPublished: false,
      likedBy: []
    });

    console.log(`✅ Health tip created by admin: ${tip.title}`);
    res.status(201).json({
      message: 'Health tip added successfully',
      tip: {
        ...tip.toObject(),
        likes: tip.likedBy.length
      }
    });
  } catch (error) {
    console.error('❌ Error adding health tip:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update health tip (admin only)
exports.updateHealthTip = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const tip = await HealthTip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    // Prevent updating default tips
    if (tip.isDefault) {
      return res.status(403).json({ message: 'Cannot edit default health tips' });
    }

    if (title) tip.title = title.trim();
    if (content) tip.content = content.trim();
    
    await tip.save();
    
    console.log(`✅ Health tip updated: ${tip.title}`);
    res.json({
      message: 'Health tip updated successfully',
      tip
    });
  } catch (error) {
    console.error('❌ Error updating health tip:', error);
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike health tip
exports.likeHealthTip = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    const userId = req.user._id.toString();
    const likedByStrings = tip.likedBy.map(id => id.toString());
    const alreadyLiked = likedByStrings.includes(userId);

    if (alreadyLiked) {
      // Unlike - remove from likedBy array
      tip.likedBy = tip.likedBy.filter(id => id.toString() !== userId);
      console.log(`👎 User unliked tip: ${tip.title}`);
    } else {
      // Like - add to likedBy array
      tip.likedBy.push(req.user._id);
      console.log(`👍 User liked tip: ${tip.title}`);
    }

    await tip.save();
    
    res.json({
      message: alreadyLiked ? 'Like removed' : 'Tip liked',
      tip: {
        ...tip.toObject(),
        likes: tip.likedBy.length  // Derive likes count from array length
      }
    });
  } catch (error) {
    console.error('❌ Error liking health tip:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete health tip (admin only)
exports.deleteHealthTip = async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    // Prevent deletion of default tips
    if (tip.isDefault) {
      return res.status(403).json({ message: 'Cannot delete default health tips' });
    }

    await HealthTip.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Health tip deleted: ${tip.title}`);
    res.json({ 
      message: 'Health tip deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('❌ Error deleting health tip:', error);
    res.status(500).json({ message: error.message });
  }
};

// Send selected tips to users (admin only)
exports.sendTipsToUsers = async (req, res) => {
  try {
    const { tipIds } = req.body;

    const selection = Array.isArray(tipIds) ? tipIds.filter(Boolean) : [tipIds].filter(Boolean);

    if (!selection || selection.length === 0) {
      return res.status(400).json({ message: 'Please select at least one tip to send' });
    }

    // Check if there are any users in the system
    const User = require('../models/User');
    const userCount = await User.countDocuments({ role: 'user' });
    
    if (userCount === 0) {
      return res.status(400).json({ message: 'No users found' });
    }

    // UNPUBLISH all tips first and RESET likes (replacement behavior)
    // Likes are stored in likedBy array, so we clear that instead of a number
    await HealthTip.updateMany(
      {}, 
      { 
        isPublished: false, 
        sentToUsers: false,
        likedBy: []
      }
    );

    // Set isPublished = true ONLY for selected tips
    await HealthTip.updateMany(
      { _id: { $in: selection } },
      { isPublished: true, sentToUsers: true }
    );

    console.log(`✅ Admin published ${selection.length} tip(s) to users (replaced previous selection, likes reset)`);
    res.json({
      message: `${selection.length} tip(s) sent to users successfully`,
      sentCount: selection.length,
      publishedTipIds: selection
    });
  } catch (error) {
    console.error('❌ Error sending tips:', error);
    res.status(500).json({ message: error.message });
  }
};
