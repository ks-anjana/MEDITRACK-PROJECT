import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/auth';

// Dynamically import to prevent circular dependencies and early load errors
let useGlobalAlertsHook = null;

// Safe hook wrapper
const useGlobalAlertsWrapper = () => {
  if (!useGlobalAlertsHook) {
    return { alerts: [] }; // Return empty alerts if hook not loaded
  }
  try {
    return useGlobalAlertsHook();
  } catch (err) {
    console.warn('⚠️ Alert hook error:', err.message);
    return { alerts: [] };
  }
};

const Alert = () => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    // Lazily load the hook on first mount
    try {
      if (!useGlobalAlertsHook) {
        const module = require('../hooks/useGlobalAlerts');
        useGlobalAlertsHook = module.useGlobalAlerts;
      }
    } catch (err) {
      console.warn('⚠️ Alert system skipped, app will work fine');
    }
  }, []);

  // Call the wrapper (safely returns empty alerts if hook unavailable)
  const { alerts } = useGlobalAlertsWrapper();

  // Update visible alerts when hook alerts change
  useEffect(() => {
    if (alerts && Array.isArray(alerts) && alerts.length > 0) {
      setVisibleAlerts(alerts);
    }
  }, [alerts]);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (visibleAlerts.length === 0) return null;

  const dismissAlert = (index) => {
    setVisibleAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Large Modal Alert Overlay */}
      {visibleAlerts.map((alert, index) => (
        <div
          key={alert.key || index}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => dismissAlert(index)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {alert.type === 'medicine' ? (
              <div>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">💊</span>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Medicine Reminder
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-600">Medicine</p>
                    <p className="text-xl font-bold text-gray-800">{alert.medicineName}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                    <p className="text-sm font-semibold text-gray-600">Timing</p>
                    <p className="text-lg text-gray-800">{alert.foodTiming}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-sm font-semibold text-gray-600">Time</p>
                    <p className="text-lg font-semibold text-gray-800">{alert.time}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Appointment Reminder
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                    <p className="text-sm font-semibold text-gray-600">Doctor</p>
                    <p className="text-xl font-bold text-gray-800">Dr. {alert.doctorName}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-600">Hospital</p>
                    <p className="text-lg text-gray-800">{alert.hospitalName}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-sm font-semibold text-gray-600">Date & Time</p>
                    <p className="text-lg font-semibold text-gray-800">{alert.date} at {alert.time}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => dismissAlert(index)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Dismiss
              </button>
              <button
                onClick={() => dismissAlert(index)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Alert;
