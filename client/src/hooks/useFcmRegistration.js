import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fcmClient } from '../services/fcm';

export const useFcmRegistration = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    fcmClient.registerDevice();

    const unsubscribe = fcmClient.onForegroundMessage((payload) => {
      const title = payload?.notification?.title || 'MediTrack Reminder';
      const body = payload?.notification?.body || 'You have a new reminder';
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: payload?.notification?.icon || '/meditrack-icon.png',
          tag: payload?.notification?.tag,
          data: payload?.data,
        });
      }
    });

    return () => unsubscribe();
  }, [token]);
};

export default useFcmRegistration;
