import { getToken, onMessage } from 'firebase/messaging';
import { messagingPromise } from '../firebase';
import { notificationAPI } from './api';

const PERMISSION_KEY = 'meditrack_fcm_permission_requested';
const TOKEN_CACHE_KEY = 'meditrack_fcm_token';
let serviceWorkerRegistrationPromise;

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }

  if (!serviceWorkerRegistrationPromise) {
    serviceWorkerRegistrationPromise = navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }

  return serviceWorkerRegistrationPromise;
};

const requestNotificationPermissionOnce = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;

  if (localStorage.getItem(PERMISSION_KEY)) {
    return Notification.permission === 'granted';
  }

  const permission = await Notification.requestPermission();
  localStorage.setItem(PERMISSION_KEY, 'true');
  return permission === 'granted';
};

const resolveMessaging = async () => {
  const messaging = await messagingPromise;
  if (!messaging) return null;
  return messaging;
};

const fetchFcmToken = async () => {
  const messaging = await resolveMessaging();
  if (!messaging) return null;

  const registration = await registerServiceWorker();
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    console.warn('VITE_FIREBASE_VAPID_KEY is missing; cannot get FCM token');
    return null;
  }

  return getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
};

const persistToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_CACHE_KEY, token);
    localStorage.setItem('fcmRegistered', 'true');
  }
};

export const fcmClient = {
  registerDevice: async () => {
    try {
      const allowed = await requestNotificationPermissionOnce();
      if (!allowed) return null;

      const token = await fetchFcmToken();
      if (!token) return null;

      const cached = localStorage.getItem(TOKEN_CACHE_KEY);
      if (cached !== token) {
        await notificationAPI.registerToken({ token, platform: 'web' });
        persistToken(token);
      }

      return token;
    } catch (error) {
      console.error('FCM registration failed:', error.message || error);
      return null;
    }
  },

  onForegroundMessage: (handler) => {
    let unsubscribe = () => {};

    resolveMessaging()
      .then((messaging) => {
        if (!messaging) return;
        unsubscribe = onMessage(messaging, (payload) => {
          if (typeof handler === 'function') {
            handler(payload);
          }
        });
      })
      .catch((err) => console.warn('FCM foreground listener error:', err?.message || err));

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  },
};
