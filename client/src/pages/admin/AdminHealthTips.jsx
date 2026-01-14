import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { isAuthenticated, isAdmin, clearAuthData } from '../../utils/auth';

const AdminHealthTips = () => {
  const navigate = useNavigate();
  const [allTips, setAllTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTip, setEditingTip] = useState(null);
  const [selectedTipIds, setSelectedTipIds] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      window.location.href = '/login';
      return;
    }
    fetchHealthTips();
  }, [navigate]);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      const response = await healthTipAPI.getAll();
      // Admin sees all tips
      const tips = response.data || [];
      
      setAllTips(tips);
      
      // Do NOT auto-select published tips - Admin must explicitly select tips
      // selectedTipIds remains empty unless Admin checks boxes
      
      setError('');
    } catch (err) {
      console.error('Error fetching health tips:', err);
      setError('Failed to load health tips');
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
    if (!formData.content.trim()) {
      setError('Content is required');
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

      if (editingTip) {
        // Update existing tip
        await healthTipAPI.update(editingTip._id, formData);
        setSuccess('✅ Health tip updated successfully!');
      } else {
        // Add new tip
        await healthTipAPI.add(formData);
        setSuccess('✅ Health tip published successfully!');
      }

      // Reset form
      setFormData({ title: '', content: '' });
      setEditingTip(null);
      
      // Refresh tips list
      await fetchHealthTips();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving health tip:', err);
      setError(err.response?.data?.message || 'Failed to save health tip');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setFormData({
      title: tip.title,
      content: tip.content,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTip(null);
    setFormData({ title: '', content: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    const tipToDelete = allTips.find(t => t._id === id);
    
    // Prevent deletion of default tips
    if (tipToDelete && tipToDelete.isDefault) {
      setError('Cannot delete default health tips');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this health tip? This will also remove it from all users.')) {
      return;
    }

    try {
      await healthTipAPI.delete(id);
      setAllTips(prev => prev.filter(tip => tip._id !== id));
      setSuccess('✅ Health tip deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting health tip:', err);
      setError(err.response?.data?.message || 'Failed to delete health tip');
    }
  };

  const handleSelectTip = (tipId) => {
    setSelectedTipIds(prev => {
      if (prev.includes(tipId)) {
        return prev.filter(id => id !== tipId);
      } else {
        return [...prev, tipId];
      }
    });
  };

  const handleSendTips = async () => {
    if (selectedTipIds.length === 0) {
      setError('Please select at least one tip to send to users');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Call the backend endpoint
      const response = await fetch(`${API_BASE_URL}/health-tips/send/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tipIds: selectedTipIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send tips');
      }

      setSuccess(`✅ Successfully sent ${selectedTipIds.length} tip(s) to all users!`);
      
      // Reset checkbox selection after successful publish
      setSelectedTipIds([]);
      
      await fetchHealthTips();
      setTimeout(() => setSuccess(''), 5001);
    } catch (err) {
      console.error('Error sending tips:', err);
      setError(err.message || 'Failed to send tips to users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">💡 Manage Health Tips</h1>
            <p className="text-blue-300 mt-1">Create and manage wellness content for users</p>
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
              <span className="font-semibold">{success}</span>
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

        {/* Form Section - Only for custom tips */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 mb-8 border border-slate-600 hover:border-green-600 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingTip ? '✏️ Edit Health Tip' : '➕ Create New Health Tip'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tip Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="Enter health tip title (e.g., Benefits of Morning Exercise)"
              />
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tip Content <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-500 resize-vertical"
                placeholder="Enter detailed health tip content..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '⏳ Saving...' : (editingTip ? '✅ Update Tip' : '➕ Publish Tip')}
              </button>
              
              {editingTip && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-800 text-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-slate-600 transition-all duration-200 border border-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* All Health Tips - Select & Send */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 mb-8 border border-slate-600">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                💡 All Health Tips ({allTips.length})
              </h2>
              <p className="text-gray-400 mt-2">Select tips to publish to users. Checkbox = published to users.</p>
            </div>
            <button
              onClick={handleSendTips}
              disabled={loading || selectedTipIds.length === 0}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Sending...' : `📤 Publish ${selectedTipIds.length} Tip(s)`}
            </button>
          </div>

          {allTips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-gray-300 text-lg font-semibold">No health tips yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first health tip above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTips.map((tip) => (
                <div
                  key={tip._id}
                  className={`bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 border transition-all duration-300 ${
                    selectedTipIds.includes(tip._id) 
                      ? 'border-green-500 shadow-lg' 
                      : 'border-slate-600 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTipIds.includes(tip._id)}
                      onChange={() => handleSelectTip(tip._id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{tip.title}</h3>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
                          <span className="text-red-400">❤️</span>
                          <span className="font-bold text-white">{tip.likes || 0}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 leading-relaxed text-sm mb-3">{tip.content}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {tip.isDefault && (
                          <span className="text-xs bg-slate-900 text-cyan-400 px-3 py-1 rounded-full">📌 Default Tip</span>
                        )}
                        {!tip.isDefault && (
                          <span className="text-xs bg-slate-900 text-purple-400 px-3 py-1 rounded-full">✍️ Custom Tip</span>
                        )}
                        {selectedTipIds.includes(tip._id) && (
                          <span className="text-xs bg-green-900 text-green-300 px-3 py-1 rounded-full">✅ Published</span>
                        )}
                      </div>
                      
                      {/* Action buttons for custom tips */}
                      {!tip.isDefault && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-600">
                          <button
                            onClick={() => handleEdit(tip)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tip._id)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
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

export default AdminHealthTips;
