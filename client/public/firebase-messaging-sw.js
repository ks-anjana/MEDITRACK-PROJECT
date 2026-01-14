/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDzcYbtaaRXOOTYP93nQPBKngKrS77l3C8",
  authDomain: "meditrack-51fcc.firebaseapp.com",
  projectId: "meditrack-51fcc",
  storageBucket: "meditrack-51fcc.firebasestorage.app",
  messagingSenderId: "838525232428",
  appId: "1:838525232428:web:3d7aea474653b68ba97889",
  measurementId: "G-J8G5E3VDRW"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, tag } = payload.notification || {};
  const notificationTitle = title || 'MediTrack Reminder';
  const notificationOptions = {
    body: body || 'You have a new reminder',
    icon: icon || '/meditrack-icon.png',
    tag,
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
