const Feedback = require('../models/Feedback');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Please provide feedback message' });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      userName: req.user.name,
      message: message.trim()
    });

    console.log(`✅ Feedback submitted by ${req.user.name}: ${message.substring(0, 50)}...`);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('❌ Submit feedback error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete feedback (only own feedback)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns this feedback
    if (feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    console.log(`✅ Feedback deleted by user: ${req.user.name} (${req.params.id})`);

    res.json({
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete feedback error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email')
      .populate('repliedBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Fetched ${feedbacks.length} feedbacks`);
    res.json(feedbacks);
  } catch (error) {
    console.error('❌ Get feedback error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reply to feedback (admin only)
exports.replyToFeedback = async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply || reply.trim() === '') {
      return res.status(400).json({ message: 'Please provide a reply message' });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.reply = reply.trim();
    feedback.repliedBy = req.user._id;
    
    await feedback.save();
    
    const updatedFeedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('repliedBy', 'name email');
    
    console.log(`✅ Admin replied to feedback: ${feedback._id}`);
    
    res.json({
      message: 'Reply added successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('❌ Reply feedback error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete reply from feedback (admin only)
exports.deleteReply = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (!feedback.reply) {
      return res.status(400).json({ message: 'No reply to delete' });
    }

    // Verify the admin who is deleting is the one who made the reply
    if (feedback.repliedBy && feedback.repliedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own replies' });
    }

    feedback.reply = '';
    feedback.replyDate = null;
    feedback.repliedBy = null;
    
    await feedback.save();
    
    const updatedFeedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('repliedBy', 'name email');
    
    console.log(`✅ Admin deleted reply from feedback: ${feedback._id}`);
    
    res.json({
      message: 'Reply deleted successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('❌ Delete reply error:', error);
    res.status(500).json({ message: error.message });
  }
};
