const User = require('../models/User.js');
const { sendPushNotification, uniqueTokens } = require('../utils/pushNotifier');

// Save or update FCM token for the authenticated user
exports.registerToken = async (req, res) => {
  try {
    const { token, platform = 'web' } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const filtered = (user.fcmTokens || []).filter((entry) => entry.token !== token);
    filtered.unshift({ token: token.trim(), platform, updatedAt: new Date() });

    // Keep last 5 tokens max to avoid unbounded growth
    user.fcmTokens = filtered.slice(0, 5);
    await user.save();

    return res.json({ message: 'FCM token registered', tokens: user.fcmTokens });
  } catch (error) {
    console.error('Error registering FCM token:', error.message);
    return res.status(500).json({ message: 'Failed to register FCM token' });
  }
};

// Generic push endpoint (useful for manual trigger/testing)
exports.sendPush = async (req, res) => {
  try {
    const { tokens = [], title, body, data = {} } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'title and body are required' });
    }

    const cleaned = uniqueTokens(tokens);
    const result = await sendPushNotification({
      tokens: cleaned,
      title,
      body,
      data,
      tag: data?.tag,
    });

    return res.json({ message: 'Push attempted', result });
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    return res.status(500).json({ message: 'Failed to send push notification' });
  }
};
