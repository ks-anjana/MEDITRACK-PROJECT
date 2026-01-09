import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { advertisementAPI } from '../../services/api';
import { isAuthenticated, isAdmin, clearAuthData } from '../../utils/auth';

const AdminAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    redirectUrl: '',
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/login');
      return;
    }
    fetchAds();
  }, [navigate]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await advertisementAPI.getAll();
      setAds(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.image.trim()) {
      setError('Image URL is required');
      return false;
    }
    if (!formData.redirectUrl.trim()) {
      setError('Redirect URL is required');
      return false;
    }
    // Validate URL format
    try {
      new URL(formData.redirectUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await advertisementAPI.add(formData);
      setSuccess('Advertisement added successfully!');
      
      setFormData({
        title: '',
        image: '',
        redirectUrl: '',
      });
      
      await fetchAds();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding advertisement:', err);
      setError(err.response?.data?.message || 'Failed to add advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      await advertisementAPI.delete(id);
      setAds(prev => prev.filter(ad => ad._id !== id));
      setSuccess('Advertisement deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting advertisement:', err);
      setError(err.response?.data?.message || 'Failed to delete advertisement');
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">📢 Manage Advertisements</h1>
            <p className="text-blue-300 mt-1">Create and manage promotional content for users</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin-dashboard')} 
              className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-all duration-200 font-semibold border border-slate-600"
            >
              ← Back to Dashboard
            </button>
            <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border-l-4 border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">✅ {success}</span>
              <button onClick={() => setSuccess('')} className="text-green-200 hover:text-green-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{error}</span>
              <button onClick={() => setError('')} className="text-red-200 hover:text-red-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Add Advertisement Form */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 mb-8 border border-slate-600 hover:border-blue-600 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6">
            ➕ Add New Advertisement
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Advertisement Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="e.g., Health Product Sale"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Image URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">
                🔗 Enter a direct link to the advertisement image
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Redirect URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-400 mt-1">
                Users will be redirected to this URL when they click the ad
              </p>
            </div>

            {/* Preview */}
            {formData.image && (
              <div className="bg-slate-900 border-2 border-blue-600 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-300 mb-3">👁️ Image Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full max-w-md rounded-lg border border-blue-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Adding...' : '➕ Add Advertisement'}
            </button>
          </form>
        </div>

        {/* Existing Ads */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 border border-slate-600">
          <h2 className="text-2xl font-bold text-white mb-6">
            📋 All Advertisements ({ads.length})
          </h2>

          {loading && ads.length === 0 ? (
            <p className="text-center text-gray-400 py-8">⏳ Loading advertisements...</p>
          ) : ads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <p className="text-gray-300 text-lg font-semibold">No advertisements yet</p>
              <p className="text-gray-500 text-sm mt-2">Add your first advertisement above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-600 hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-48 object-cover border-b border-slate-600"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 truncate">
                      🔗 {ad.redirectUrl}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={ad.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-center text-sm font-semibold"
                      >
                        🔗 Preview
                      </a>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 border-t border-slate-600 pt-2">
                      📅 Posted: {new Date(ad.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAds;
