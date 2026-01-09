import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('user'); // 'user' or 'admin'

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Pass role to ensure role-based login restriction
      await login(formData.email, formData.password, role);

      // Redirect based on role
      // User goes to welcome screen first, Admin goes directly to dashboard
      const redirectPath = role === 'admin' ? '/admin-dashboard' : '/welcome';
      setTimeout(() => {
        navigate(redirectPath);
      }, 500);
    } catch (err) {
      // Error is handled by authError from useAuth
      // Ensure error message is captured from backend response
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      console.error('Login error:', errorMessage);
    }
  };

  // Toggle between user and admin
  const toggleRole = () => {
    setRole(role === 'user' ? 'admin' : 'user');
    setErrors({}); // Clear errors when switching
    // Clear auth error when switching roles
    if (authError) {
      clearError();
    }
  };

  // Dynamic background based on role
  const bgClass = 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900';
  
  const headerGradient = role === 'admin'
    ? 'bg-gradient-to-r from-blue-500 to-sky-500'
    : 'bg-gradient-to-r from-cyan-400 to-sky-400';
  
  const titleColor = 'text-white';
  const subtitleColor = role === 'admin' ? 'text-blue-200' : 'text-cyan-200';
  const formBg = 'bg-gray-800';
  const labelColor = 'text-gray-100';
  const buttonGradient = role === 'admin'
    ? 'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600'
    : 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600';
  const toggleBg = role === 'admin'
    ? 'bg-slate-700 hover:bg-slate-600 border-blue-600 text-blue-300'
    : 'bg-slate-700 hover:bg-slate-600 border-cyan-600 text-cyan-300';
  const borderColor = 'border-slate-700';

  return (
    <div className={`${bgClass} flex items-center justify-center p-4`}>
      {/* Centered Login Card */}
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${headerGradient} rounded-full shadow-lg mb-4`} style={{boxShadow: role === 'admin' ? '0 20px 25px -5px rgba(37, 99, 235, 0.3)' : '0 20px 25px -5px rgba(16, 185, 129, 0.3)'}}>
            <span className="text-3xl">{role === 'admin' ? '👨‍💼' : '💊'}</span>
          </div>
          <h1 className={`text-3xl font-bold ${titleColor} mb-2`}>
            {role === 'admin' ? 'Admin Portal' : 'Welcome to MediTrack'}
          </h1>
          <p className={`text-sm ${subtitleColor}`}>
            {role === 'admin' ? 'Manage your healthcare platform' : 'Your health companion'}
          </p>
        </div>

        {/* Login Form Card */}
        <div className={`${formBg} rounded-xl shadow-xl p-8 border ${borderColor}`}>
          {authError && (
            <div className="mb-6">
              <Alert
                type="error"
                message={authError}
                onClose={() => clearError()}
                autoClose={false}
              />
            </div>
          )}

          {/* Role Heading */}
          <h2 className={`text-xl font-semibold ${labelColor} mb-6 text-center`}>
            {role === 'admin' ? 'Admin Login' : 'User Login'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className={`w-full ${buttonGradient} text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`} style={{boxShadow: role === 'admin' ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : '0 10px 15px -3px rgba(16, 185, 129, 0.2)'}}
            >
              {loading ? 'Signing in...' : (role === 'admin' ? 'Login as Admin' : 'Login as User')}
            </Button>
          </form>

          {/* Register Link - User Mode Only */}
          {role === 'user' && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-center text-sm text-gray-300">
                New to MediTrack?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors duration-200"
                >
                  Create account
                </Link>
              </p>
            </div>
          )}

          {/* Toggle Role Button */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={toggleRole}
              className={`w-full py-2 px-4 text-sm font-medium ${toggleBg} border rounded-lg transition-colors duration-200`}
            >
              Switch to {role === 'user' ? 'Admin' : 'User'} Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
