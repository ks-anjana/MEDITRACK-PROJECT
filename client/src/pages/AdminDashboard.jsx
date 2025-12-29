import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch health tips on mount
  useEffect(() => {
    seedAndFetchHealthTips();
  }, []);

  // Seed default health tips (first time only) and fetch
  const seedAndFetchHealthTips = async () => {
    try {
      setLoading(true);
      // Try to seed health tips (will do nothing if already seeded)
      await adminAPI.seedHealthTips();
      // Fetch all health tips
      await fetchHealthTips();
    } catch (error) {
      console.error('Error seeding health tips:', error);
      // Still try to fetch existing tips
      await fetchHealthTips();
    } finally {
      setLoading(false);
    }
  };

  // Fetch health tips
  const fetchHealthTips = async () => {
    try {
      const response = await adminAPI.getHealthTips();
      setHealthTips(response.data.healthTips || []);
    } catch (error) {
      setErrorMessage('Failed to fetch health tips');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      setLoading(true);
      await adminAPI.createHealthTip(formData);

      setSuccessMessage('Post Completed');
      setFormData({
        title: '',
        description: '',
      });

      // Refresh health tips list
      await fetchHealthTips();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create health tip');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Admin</h1>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Health Tip Management</h2>
          <p className="text-gray-600">
            Create and manage health tips that are visible to all users.
          </p>
        </div>

        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {errorMessage && (
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Create Health Tip Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Health Tip</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              type="text"
              name="title"
              placeholder="e.g., Stay Hydrated"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter detailed health tip description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="5"
              />
              {errors.description && (
                <p className="error-message">{errors.description}</p>
              )}
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Posting...' : 'Post Health Tip'}
            </Button>
          </form>
        </div>

        {/* Health Tips List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            All Health Tips ({healthTips.length})
          </h3>

          {healthTips.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No health tips available yet.
            </p>
          ) : (
            <div className="space-y-6">
              {healthTips.map((tip) => (
                <div
                  key={tip._id}
                  className="border border-purple-200 bg-purple-50 rounded-lg p-6"
                >
                  <h4 className="text-xl font-bold text-purple-800 mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-gray-700 mb-3">{tip.description}</p>
                  <p className="text-sm text-gray-500">
                    Posted: {new Date(tip.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Login Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
