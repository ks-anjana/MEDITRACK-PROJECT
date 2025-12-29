import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MedicineScheduler from './pages/MedicineScheduler';
import AppointmentTracker from './pages/AppointmentTracker';
import PrescriptionUpload from './pages/PrescriptionUpload';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// App Content (inside Router context)
const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - User */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medicine-scheduler"
        element={
          <ProtectedRoute requiredRole="user">
            <MedicineScheduler />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment-tracker"
        element={
          <ProtectedRoute requiredRole="user">
            <AppointmentTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription-upload"
        element={
          <ProtectedRoute requiredRole="user">
            <PrescriptionUpload />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/user-dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
