import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../../services/api';
import { isAuthenticated, isAdmin, clearAuthData } from '../../utils/auth';

const AdminFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [replyData, setReplyData] = useState({});

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/login');
      return;
    }
    fetchAllFeedback();
  }, [navigate]);

  const fetchAllFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (feedbackId, value) => {
    setReplyData(prev => ({
      ...prev,
      [feedbackId]: value
    }));
  };

  const handleSendReply = async (feedbackId) => {
    const reply = replyData[feedbackId];
    
    if (!reply || !reply.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await feedbackAPI.reply(feedbackId, { reply });
      
      setSuccess('✅ Reply sent successfully!');
      setReplyData(prev => ({
        ...prev,
        [feedbackId]: ''
      }));
      
      await fetchAllFeedback();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleDeleteReply = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await feedbackAPI.deleteReply(feedbackId);
      
      setSuccess('✅ Reply deleted successfully!');
      
      await fetchAllFeedback();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting reply:', err);
      setError(err.response?.data?.message || 'Failed to delete reply');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">💬 User Feedback</h1>
            <p className="text-blue-300 mt-1">View and respond to user feedback</p>
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

        {/* Feedback List */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 border border-slate-600">
          <h2 className="text-2xl font-bold text-white mb-6">
            📋 All User Feedback ({feedbacks.length})
          </h2>

          {loading && feedbacks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">⏳ Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-300 text-lg font-semibold">No feedback yet</p>
              <p className="text-gray-500 text-sm mt-2">Users will start submitting feedback here</p>
            </div>
          ) : (
            <div className="space-y-5">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300"
                >
                  {/* Feedback Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {feedback.userId?.userName || feedback.userId?.name || 'Unknown User'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        📧 {feedback.userId?.email || 'No email'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === feedback._id ? null : feedback._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                    >
                      {expandedId === feedback._id ? '▼ Collapse' : '▶ Expand'}
                    </button>
                  </div>

                  {/* Feedback Content */}
                  <div className="bg-gray-900 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <p className="text-gray-300 leading-relaxed">{feedback.message}</p>
                  </div>

                  {/* Expanded Reply Section */}
                  {expandedId === feedback._id && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      {/* Existing Replies */}
                      {feedback.reply && (
                        <div className="bg-slate-900 border border-green-600 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-green-400 font-semibold">✅ Admin Reply:</p>
                            <button
                              onClick={() => handleDeleteReply(feedback._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-all duration-200 font-semibold"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          <p className="text-gray-300">{feedback.reply}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            🕐 {feedback.replyDate ? formatDate(feedback.replyDate) : 'Date unknown'}
                          </p>
                        </div>
                      )}

                      {/* New Reply Input */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-300">
                          {feedback.reply ? '📝 Update Reply' : '📝 Send Reply'}
                        </label>
                        <textarea
                          value={replyData[feedback._id] || ''}
                          onChange={(e) => handleReplyChange(feedback._id, e.target.value)}
                          className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500 resize-vertical"
                          rows="3"
                          placeholder="Type your reply here..."
                        />
                        <button
                          onClick={() => handleSendReply(feedback._id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                          disabled={loading || !replyData[feedback._id]?.trim()}
                        >
                          {loading ? '⏳ Sending...' : '✉️ Send Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminFeedback;
