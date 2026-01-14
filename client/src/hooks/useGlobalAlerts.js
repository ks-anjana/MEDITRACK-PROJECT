import React, { useEffect, useState } from 'react';
import { medicineAPI, appointmentAPI } from '../services/api';
import { alertManager } from '../services/AlertManager';

/**
 * Custom hook for global alert checking
 * This hook can be used in any component to enable alert checking
 */
export const useGlobalAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [checkInterval, setCheckInterval] = useState(null);

  useEffect(() => {
    try {
      // Initialize alert manager
      if (!alertManager) {
        console.warn('⚠️ Alert manager not available');
        return;
      }

      alertManager.initialize();

      // Subscribe to alert changes
      const unsubscribe = alertManager.subscribe((newAlerts) => {
        try {
          console.log('🔔 New alerts received:', newAlerts);
          setAlerts(newAlerts);

          // Show browser notifications
          newAlerts.forEach(alert => {
            showBrowserNotification(alert);
          });

          // Keep modal visible for longer (20 seconds) so user has time to read
          const timeout = setTimeout(() => {
            setAlerts([]);
          }, 20000);

          return () => clearTimeout(timeout);
        } catch (err) {
          console.warn('⚠️ Alert subscription handler error:', err.message);
        }
      });

      // Set up interval to check alerts every 60 seconds (1 minute)
      const interval = setInterval(checkAlerts, 60000);
      setCheckInterval(interval);

      // Cleanup
      return () => {
        unsubscribe();
        if (interval) clearInterval(interval);
      };
    } catch (err) {
      console.warn('⚠️ useGlobalAlerts initialization error:', err.message);
      // Continue without alerts instead of crashing
    }
  }, []);

  const checkAlerts = async () => {
    try {
      console.log('🔍 Checking for alerts...');
      
      const [medicineRes, appointmentRes] = await Promise.all([
        medicineAPI.checkAlerts().catch(err => {
          console.error('Medicine alerts error:', err);
          return { data: { alerts: [] } };
        }),
        appointmentAPI.checkAlerts().catch(err => {
          console.error('Appointment alerts error:', err);
          return { data: { alerts: [] } };
        }),
      ]);

      const allAlerts = [
        ...(medicineRes.data.alerts || []).map(a => ({ ...a, type: 'medicine' })),
        ...(appointmentRes.data.alerts || []).map(a => ({ ...a, type: 'appointment' })),
      ];

      // Process alerts through manager to avoid duplicates
      const newAlerts = alertManager.processAlerts(allAlerts);
      console.log(`✅ Found ${newAlerts.length} unique alert(s)`);
    } catch (error) {
      console.error('❌ Error checking alerts:', error);
    }
  };

  return { alerts, checkAlerts };
};

/**
 * Show browser notification
 */
const showBrowserNotification = (alert) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    let title, body, icon;

    if (alert.type === 'medicine') {
      title = '💊 Medicine Reminder';
      body = `Time to take: ${alert.medicineName}\n${alert.foodTiming}`;
      icon = '/medicine-icon.png';
    } else {
      title = '📅 Appointment Reminder';
      body = `Appointment with Dr. ${alert.doctorName}\nat ${alert.hospitalName}`;
      icon = '/appointment-icon.png';
    }

    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      tag: alert.key,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

export default useGlobalAlerts;
