import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { isAuthenticated, clearAuthData, getUserName, getUser } from '../utils/auth';

const AccountSettings = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');
      await userAPI.deleteAccount();
      clearAuthData();
      navigate('/register');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
              <p className="text-purple-100 mt-1">Manage your account preferences</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/user-dashboard')} className="btn-secondary">
                Back to Dashboard
              </button>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Information */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-100">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-purple-300">Name</label>
              <p className="text-lg text-slate-200">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300">Email</label>
              <p className="text-lg text-slate-200">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300">Role</label>
              <p className="text-lg text-slate-200 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-2 border-red-200">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-red-800 mb-2">Delete Account</h3>
            <p className="text-slate-300 mb-4">
              Once you delete your account, there is no going back. This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">
              <li>Your profile information</li>
              <li>All your medicines</li>
              <li>All your appointments</li>
              <li>All your prescriptions</li>
              <li>All your feedback</li>
            </ul>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="font-bold text-red-800">Are you absolutely sure?</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete Forever'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-slate-600 text-slate-200 px-6 py-2 rounded-lg hover:bg-slate-500 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
