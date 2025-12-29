import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch health tips on mount
  useEffect(() => {
    fetchHealthTips();
  }, []);

  // Fetch health tips
  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getHealthTips();
      setHealthTips(response.data.healthTips || []);
    } catch (error) {
      console.error('Failed to fetch health tips:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to MediTrack
            </h1>
            <p className="text-gray-600 mt-2">Hello, {user?.name}!</p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Medicine Scheduler Card */}
          <Card className="hover:shadow-xl transition transform hover:scale-105">
            <div className="text-center">
              <div className="text-5xl mb-4">💊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Medicine Scheduler
              </h2>
              <p className="text-gray-600 mb-6">
                Schedule your medicines and get reminders at the right time.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/medicine-scheduler')}
                className="w-full"
              >
                Schedule Medicine
              </Button>
            </div>
          </Card>

          {/* Appointment Tracker Card */}
          <Card className="hover:shadow-xl transition transform hover:scale-105">
            <div className="text-center">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Appointment Tracker
              </h2>
              <p className="text-gray-600 mb-6">
                Track your doctor appointments and get advance reminders.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate('/appointment-tracker')}
                className="w-full"
              >
                Track Appointments
              </Button>
            </div>
          </Card>

          {/* Prescription Upload Card */}
          <Card className="hover:shadow-xl transition transform hover:scale-105">
            <div className="text-center">
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Prescription Upload
              </h2>
              <p className="text-gray-600 mb-6">
                Upload and store your prescriptions digitally.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/prescription-upload')}
                className="w-full"
              >
                Upload Prescription
              </Button>
            </div>
          </Card>
        </div>

        {/* Health Tips Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Health Tips</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading health tips...</p>
          ) : healthTips.length === 0 ? (
            <p className="text-center text-gray-600">
              No health tips available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthTips.map((tip) => (
                <div
                  key={tip._id}
                  className="border border-blue-200 bg-blue-50 rounded-lg p-6 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
