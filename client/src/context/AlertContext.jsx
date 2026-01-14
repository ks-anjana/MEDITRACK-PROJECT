import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { medicineAPI, appointmentAPI } from '../services/api';

const AlertContext = createContext();

// In-memory alert tracking
const shownAlerts = new Set();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const pollingIntervalRef = useRef(null);
  const checkTimeoutRef = useRef(null);

  // Check for alerts
  const checkAlerts = useCallback(async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found, skipping alert check');
        return;
      }

      console.log('🔍 [ALERT] Checking for alerts at', new Date().toLocaleTimeString());
      
      const [medicineRes, appointmentRes] = await Promise.all([
        medicineAPI.checkAlerts().catch(err => {
          console.error('❌ [ALERT] Medicine alerts error:', err.message);
          return { data: { alerts: [] } };
        }),
        appointmentAPI.checkAlerts().catch(err => {
          console.error('❌ [ALERT] Appointment alerts error:', err.message);
          return { data: { alerts: [] } };
        }),
      ]);

      const medicineAlerts = (medicineRes.data?.alerts || []).map(a => ({ 
        ...a, 
        type: 'medicine',
        key: `medicine-${a.medicineId}-${a.time}`
      }));
      
      const appointmentAlerts = (appointmentRes.data?.alerts || []).map(a => ({ 
        ...a, 
        type: 'appointment',
        key: `appointment-${a.appointmentId}-${a.time}`
      }));

      const allAlerts = [...medicineAlerts, ...appointmentAlerts];
      console.log(`📊 [ALERT] Total alerts from backend: ${allAlerts.length}`, allAlerts);

      // Filter out alerts we've already shown
      const newAlerts = allAlerts.filter(alert => {
        const isNew = !shownAlerts.has(alert.key);
        if (!isNew) {
          console.log(`⏭️  [ALERT] Already shown: ${alert.key}`);
        }
        return isNew;
      });

      if (newAlerts.length > 0) {
        console.log(`🚨 [ALERT] NEW ALERTS FOUND: ${newAlerts.length}`, newAlerts);
        
        // Mark as shown IMMEDIATELY
        newAlerts.forEach(alert => {
          shownAlerts.add(alert.key);
          console.log(`✅ [ALERT] Marked as shown: ${alert.key}`);
        });
        
        // Update state to show modal
        setAlerts(newAlerts);
        
        // Show browser notifications
        newAlerts.forEach(alert => {
          showBrowserNotification(alert);
        });
      } else {
        console.log('ℹ️  [ALERT] No new alerts');
      }
    } catch (error) {
      console.error('❌ [ALERT] Error checking alerts:', error);
    }
  }, []);

  // Initialize alert system
  useEffect(() => {
    console.log('🟢 [ALERT] Initializing AlertProvider');
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log(`🔔 [ALERT] Notification permission: ${permission}`);
      });
    }

    setIsInitialized(true);

    // Set up polling interval (every 60 seconds / 1 minute)
    pollingIntervalRef.current = setInterval(() => {
      checkAlerts();
    }, 60000);

    console.log('🟢 [ALERT] Alert polling started (every 60 seconds)');

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        console.log('🔴 [ALERT] Alert polling stopped');
      }
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - run once on mount

  // Close/dismiss alerts
  const dismissAlerts = useCallback(() => {
    console.log('👋 [ALERT] Dismissing alerts');
    setAlerts([]);
  }, []);

  const value = {
    alerts,
    dismissAlerts,
    checkAlerts,
    isInitialized,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

/**
 * Show browser notification
 */
const showBrowserNotification = (alert) => {
  try {
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
      
      console.log('🔔 [ALERT] Browser notification shown:', title);
    }
  } catch (err) {
    console.error('❌ [ALERT] Error showing browser notification:', err);
  }
};

export default AlertContext;
