import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDzcYbtaaRXOOTYP93nQPBKngKrS77l3C8',
  authDomain: 'meditrack-51fcc.firebaseapp.com',
  projectId: 'meditrack-51fcc',
  storageBucket: 'meditrack-51fcc.firebasestorage.app',
  messagingSenderId: '838525232428',
  appId: '1:838525232428:web:3d7aea474653b68ba97889',
  measurementId: 'G-J8G5E3VDRW',
};

const firebaseApp = initializeApp(firebaseConfig);

// messaging is async because isSupported resolves at runtime on some browsers
const messagingPromise = isSupported()
  .then((supported) => (supported ? getMessaging(firebaseApp) : null))
  .catch((err) => {
    console.warn('FCM not supported in this browser:', err?.message || err);
    return null;
  });

export { firebaseApp, messagingPromise };
