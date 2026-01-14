const axios = require('axios');

const FCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';

// Return unique tokens only
const uniqueTokens = (tokens = []) => {
  return Array.from(new Set(tokens.filter(Boolean)));
};

// Send push notification via FCM legacy HTTP API
const sendPushNotification = async ({ tokens = [], title, body, data = {}, tag }) => {
  const serverKey = process.env.FCM_SERVER_KEY;

  const cleanedTokens = uniqueTokens(tokens);
  if (!cleanedTokens.length) {
    console.log('No users found to notify');
    return { skipped: true, reason: 'no-tokens' };
  }

  if (!serverKey) {
    console.warn('FCM_SERVER_KEY not configured; skipping push');
    return { skipped: true, reason: 'missing-server-key', tokens: cleanedTokens.length };
  }

  const payload = {
    registration_ids: cleanedTokens,
    notification: {
      title,
      body,
      tag,
      icon: '/medicine-icon.png',
    },
    data,
    priority: 'high',
  };

  try {
    const response = await axios.post(FCM_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${serverKey}`,
      },
      timeout: 5001,
    });

    console.log(`Push send status: ${response.data?.success || 0} success / ${response.data?.failure || 0} failed`);
    return response.data;
  } catch (error) {
    console.error('Push send error:', error.response?.data || error.message);
    return { error: error.message };
  }
};

// Pull tokens from user docs safely
const extractUserTokens = (users = []) => {
  const tokens = [];
  users.forEach((user) => {
    (user.fcmTokens || []).forEach((entry) => {
      if (entry?.token) {
        tokens.push(entry.token);
      }
    });
  });
  return uniqueTokens(tokens);
};

module.exports = { sendPushNotification, extractUserTokens, uniqueTokens };
