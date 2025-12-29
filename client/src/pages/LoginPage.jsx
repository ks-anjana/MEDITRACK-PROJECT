import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [userLoginMode, setUserLoginMode] = useState(true); // true for user, false for admin

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
      const role = userLoginMode ? 'user' : 'admin';
      await login(formData.email, formData.password, role);

      // Redirect based on role
      setTimeout(() => {
        if (userLoginMode) {
          navigate('/user-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      }, 500);
    } catch (err) {
      // Error is handled by authError from useAuth
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">MediTrack</h1>
        <p className="text-center text-gray-600 mb-6">Healthcare Reminder System</p>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {userLoginMode ? 'User Login' : 'Admin Login'}
        </h2>

        {authError && (
          <Alert
            type="error"
            message={authError}
            onClose={() => {}}
            autoClose={true}
            duration={5000}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 font-medium hover:underline">
              Register here
            </Link>
          </p>

          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setUserLoginMode(!userLoginMode)}
              className="w-full text-blue-600 font-medium hover:underline text-sm"
            >
              {userLoginMode
                ? 'Switch to Admin Login →'
                : '← Switch to User Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
