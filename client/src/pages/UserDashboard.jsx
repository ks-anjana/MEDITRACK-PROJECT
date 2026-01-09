import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, clearAuthData, isAuthenticated } from '../utils/auth';
import { userAPI, advertisementAPI } from '../services/api';
import Alert from '../components/Alert';

const UserDashboard = () => {
  const navigate = useNavigate();
  const userName = getUserName();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchAds();
  }, [navigate]);

  const fetchAds = async () => {
    try {
      const response = await advertisementAPI.getAll();
      setAds(response.data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleAdClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');
      await userAPI.deleteAccount();
      clearAuthData();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Alert Component for Reminders */}
      <Alert />

      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome to MediTrack
              </h1>
              <p className="text-lg text-cyan-100 mt-2">
                Hello, <span className="font-semibold text-white">{userName}</span>! 👋
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-cyan-700 px-6 py-3 rounded-lg hover:bg-cyan-50 transition-all duration-200 font-semibold shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="text-red-700 hover:text-red-900 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Medicine Scheduler Card */}
          <div 
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-cyan-500/20 border border-slate-700 p-6"
            onClick={() => navigate('/medicine-scheduler')}
          >
            <div className="text-5xl mb-4">💊</div>
            <h3 className="text-xl font-bold mb-2 text-white">Medicine Scheduler</h3>
            <p className="text-gray-300">Manage your daily medications with timely reminders</p>
          </div>

          {/* Appointment Tracker Card */}
          <div 
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-sky-500/20 border border-slate-700 p-6"
            onClick={() => navigate('/appointment-tracker')}
          >
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2 text-white">Appointment Tracker</h3>
            <p className="text-gray-300">Never miss a doctor appointment</p>
          </div>

          {/* Prescription Upload Card */}
          <div 
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-cyan-500/20 border border-slate-700 p-6"
            onClick={() => navigate('/prescription-upload')}
          >
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-2 text-white">Prescription Upload</h3>
            <p className="text-gray-300">Digitize and organize your prescriptions</p>
          </div>

          {/* Health Tips Card */}
          <div 
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-sky-500/20 border border-slate-700 p-6"
            onClick={() => navigate('/health-tips')}
          >
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-2 text-white">Health Tips</h3>
            <p className="text-gray-300">Get expert health advice and wellness tips</p>
          </div>

          {/* Feedback Card */}
          <div 
            className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-cyan-500/20 border border-slate-700 p-6"
            onClick={() => navigate('/feedback')}
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2 text-white">Feedback</h3>
            <p className="text-gray-300">Share your thoughts and improve MediTrack</p>
          </div>
        </div>

        {/* Advertisements Section */}
        {ads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📢</span>
              Sponsored Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  onClick={() => handleAdClick(ad.redirectUrl)}
                  className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden border border-slate-700"
                >
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{ad.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">✨ Sponsored Content</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Account Section */}
        <div className="bg-gray-800 rounded-xl shadow-md border border-red-600 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-400 mb-2">Delete My Account</h3>
              <p className="text-gray-300 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-md"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-3 bg-red-900/30 border border-red-800 p-4 rounded-lg">
                  <p className="font-bold text-red-300">
                    ⚠️ Are you absolutely sure? This will permanently delete:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                    <li>Your profile and login credentials</li>
                    <li>All your medicines and schedules</li>
                    <li>All your appointments</li>
                    <li>All your prescriptions</li>
                    <li>All your feedback and comments</li>
                  </ul>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 shadow-md"
                    >
                      {loading ? 'Deleting...' : 'Yes, Delete Forever'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-slate-700 text-gray-200 px-6 py-2 rounded-lg hover:bg-slate-600 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;