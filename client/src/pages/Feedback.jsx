import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../services/api';
import { isAuthenticated, getUserName, getUserId } from '../utils/auth';
import Alert from '../components/Alert';

const Feedback = () => {
  const navigate = useNavigate();
  const userName = getUserName();
  const currentUserId = getUserId();
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchFeedbacks();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    try {
      setFetchLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedbacks(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.response?.data?.message || 'Failed to load feedback');
      setFeedbacks([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter your feedback');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await feedbackAPI.submit({ message: message.trim() });
      
      setSuccess('✅ Feedback submitted successfully! Thank you for your input.');
      setMessage('');
      
      // Refresh feedback list
      await fetchFeedbacks();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackAPI.delete(feedbackId);
      setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
      setSuccess('✅ Feedback deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.response?.data?.message || 'Failed to delete feedback. Please try again.');
    }
  };

  const sortedFeedbacks = [...feedbacks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Global Alert Component */}
      <Alert />

      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/user-dashboard')} 
              className="bg-white text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-50 transition-all duration-200 font-semibold mr-4"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white">💬 Feedback</h1>
              <p className="text-cyan-100 mt-1">Share your thoughts and help us improve</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="bg-cyan-900 border-l-4 border-cyan-500 text-cyan-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{success}</span>
              <button onClick={() => setSuccess('')} className="text-cyan-200 hover:text-cyan-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

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

        {/* Submit Feedback Form */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border-t-4 border-cyan-500">
          <h2 className="text-2xl font-bold mb-6 text-cyan-100">📝 Share Your Feedback</h2>
          <p className="text-gray-300 mb-6">
            We value your opinion! Share your experience, suggestions, or report any issues. Help us make MediTrack better!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-vertical placeholder-slate-400"
                rows="6"
                placeholder="Tell us what you think about MediTrack. Your feedback helps us improve!"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Submitting...' : '✅ Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-cyan-500">
          <h2 className="text-2xl font-bold mb-6 text-cyan-100">
            📋 Feedback ({sortedFeedbacks.length})
          </h2>

          {fetchLoading ? (
            <p className="text-center text-gray-300 py-8">⏳ Loading your feedback...</p>
          ) : sortedFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-300 text-lg font-semibold">No feedback submitted yet</p>
              <p className="text-gray-400 text-sm mt-2">Your submitted feedback will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-slate-900 border-l-4 border-cyan-500 rounded-lg p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-slate-200 leading-relaxed mb-2">
                        {feedback.message}
                      </p>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>👤 {feedback.userName || feedback.userId?.name || 'User'}</div>
                        <div>📅 {new Date(feedback.createdAt).toLocaleDateString()} • {new Date(feedback.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                    {(feedback.userId === currentUserId || feedback.userId._id === currentUserId) && (
                      <button
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold whitespace-nowrap"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                  
                  {/* Admin Reply Section */}
                  {feedback.reply && (
                    <div className="mt-4 pt-4 border-t-2 border-cyan-600">
                      <div className="bg-slate-600 rounded-lg p-4 border-l-4 border-cyan-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-cyan-400 font-bold text-sm">✅ Admin Reply</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                          {feedback.reply}
                        </p>
                        {feedback.replyDate && (
                          <div className="text-xs text-gray-400 mt-2">
                            ⏰ {new Date(feedback.replyDate).toLocaleDateString()} • {new Date(feedback.replyDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
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

export default Feedback;
