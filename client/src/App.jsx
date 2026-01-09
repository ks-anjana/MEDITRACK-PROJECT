import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AlertProvider, useAlerts } from './context/AlertContext';

// Components
import GlobalAlertModal from './components/GlobalAlertModal';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Welcome from './pages/Welcome';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MedicineScheduler from './pages/MedicineScheduler';
import AppointmentTracker from './pages/AppointmentTracker';
import PrescriptionUpload from './pages/PrescriptionUpload';
import HealthTips from './pages/HealthTips';
import Feedback from './pages/Feedback';
import AdminHealthTips from './pages/admin/AdminHealthTips';
import AdminAds from './pages/admin/AdminAds';
import AdminFeedback from './pages/admin/AdminFeedback';

const AppContent = () => {
  const { alerts, dismissAlerts } = useAlerts();

  return (
    <>
      <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/welcome" element={<Welcome />} />

      {/* User Routes */}
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/medicine-scheduler" element={<MedicineScheduler />} />
      <Route path="/appointment-tracker" element={<AppointmentTracker />} />
      <Route path="/prescription-upload" element={<PrescriptionUpload />} />
      <Route path="/health-tips" element={<HealthTips />} />
      <Route path="/feedback" element={<Feedback />} />

      {/* Admin Routes - All variations */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/health-tips" element={<AdminHealthTips />} />
      <Route path="/admin/advertisements" element={<AdminAds />} />
      <Route path="/admin/ads" element={<AdminAds />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
              <a
                href="/user-dashboard"
                className="btn-primary"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
    
    {/* Global Alert Modal - Shows on all pages */}
    <GlobalAlertModal alerts={alerts} onClose={dismissAlerts} />
    </>
  );
};

const App = () => {
  return (
    <AlertProvider>
      <AppContent />
    </AlertProvider>
  );
};

export default App;