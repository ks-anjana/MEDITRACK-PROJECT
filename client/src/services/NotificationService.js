import React from 'react';

// Notification Service for Browser Notifications
export const NotificationService = {
  // Request permission for notifications
  requestPermission: async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
    return false;
  },

  // Send notification
  sendNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/meditrack-icon.png',
        ...options,
      });
    }
  },

  // Check if notifications are enabled
  isEnabled: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },
};

// Custom Hook for using Notification Service
export const useNotification = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  React.useEffect(() => {
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setIsEnabled(true);
        return true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        setIsEnabled(permission === 'granted');
        return permission === 'granted';
      }
    }
    return false;
  };

  const sendNotification = (title, options = {}) => {
    if (isEnabled) {
      NotificationService.sendNotification(title, options);
    }
  };

  return {
    isEnabled,
    requestPermission,
    sendNotification,
  };
};

export default NotificationService;
