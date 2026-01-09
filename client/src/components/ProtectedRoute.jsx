import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

// Protected Route Component - ensures user is authenticated with correct role
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Admin route - check for admin role
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/user-dashboard" replace />;
  }

  // All checks passed - render protected content
  return children;
};

export default ProtectedRoute;
