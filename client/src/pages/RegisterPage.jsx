import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const RegisterPage = () => {
  const { register, loading, error: authError, clearError, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.name, formData.email, formData.password, 'user');

      // Show success message on same page (no redirect)
      setSuccessMessage('✅ Registration successful! Please login to continue.');
      setShowAlert(true);

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});

      // Clear any auto-login side effects from the register call
      logout();
    } catch (err) {
      // Error is handled by authError from useAuth
      // Ensure error message is captured from backend response
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      console.error('Registration error:', errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full shadow-lg shadow-cyan-500/30 mb-4">
            <span className="text-3xl">💊</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome to MediTrack
          </h1>
          <p className="text-cyan-200 text-sm font-medium">Healthcare Reminder System</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-6 text-center">Create Account</h2>

          {showAlert && successMessage && (
            <div className="mb-6">
              <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500 bg-emerald-900/50 px-4 py-3 text-emerald-100">
                <div>
                  <p className="font-semibold">{successMessage}</p>
                </div>
                <Link
                  to="/login"
                  className="shrink-0 rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition-colors duration-200"
                  onClick={() => setShowAlert(false)}
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

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
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 text-slate-900 font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
