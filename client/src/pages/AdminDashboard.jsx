import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { getUserName, clearAuthData, isAuthenticated, isAdmin } from '../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = getUserName();
  const [stats, setStats] = useState({
    userCount: 0,
    tipsCount: 0,
    adsCount: 0,
    feedbackCount: 0,
    tips: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            👨‍💼 Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-300 font-semibold">Welcome, {adminName}!</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 shadow-md">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-6 border border-blue-700 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-blue-300 text-sm font-semibold">Total Users</div>
                <div className="text-4xl font-bold text-white mt-2">{stats.userCount}</div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="text-xs text-blue-300 mt-4">Active users in system</div>
          </div>

          {/* Total Health Tips Card */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl shadow-lg p-6 border border-green-700 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-green-300 text-sm font-semibold">Health Tips</div>
                <div className="text-4xl font-bold text-white mt-2">{stats.tipsCount}</div>
              </div>
              <div className="text-4xl">💡</div>
            </div>
            <div className="text-xs text-green-300 mt-4">Tips published</div>
          </div>

          {/* Total Advertisements Card */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-6 border border-blue-700 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-blue-300 text-sm font-semibold">Advertisements</div>
                <div className="text-4xl font-bold text-white mt-2">{stats.adsCount}</div>
              </div>
              <div className="text-4xl">📢</div>
            </div>
            <div className="text-xs text-blue-300 mt-4">Active campaigns</div>
          </div>

          {/* Total Feedback Card */}
          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-xl shadow-lg p-6 border border-orange-700 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-orange-300 text-sm font-semibold">Feedback</div>
                <div className="text-4xl font-bold text-white mt-2">{stats.feedbackCount}</div>
              </div>
              <div className="text-4xl">💬</div>
            </div>
            <div className="text-xs text-orange-300 mt-4">User submissions</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Health Tips */}
          <div
            className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl shadow-lg p-6 border border-green-700 hover:shadow-xl hover:border-green-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => navigate('/admin/health-tips')}
          >
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Health Tips</h3>
            <p className="text-green-200 text-sm">Add, edit, and delete health tips for users</p>
          </div>

          {/* Manage Advertisements */}
          <div
            className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl shadow-lg p-6 border border-blue-700 hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => navigate('/admin/ads')}
          >
            <div className="text-5xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Advertisements</h3>
            <p className="text-blue-200 text-sm">Create and manage promotional campaigns</p>
          </div>

          {/* View Feedback */}
          <div
            className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-xl shadow-lg p-6 border border-orange-700 hover:shadow-xl hover:border-orange-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => navigate('/admin/feedback')}
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">View User Feedback</h3>
            <p className="text-orange-200 text-sm">Review and respond to user feedback</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
