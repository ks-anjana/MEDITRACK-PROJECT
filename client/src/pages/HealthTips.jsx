import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthTipAPI } from '../services/api';
import { isAuthenticated, getUserId } from '../utils/auth';
import Alert from '../components/Alert';

const HealthTips = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchHealthTips();
  }, [navigate]);

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await healthTipAPI.getAll();
      const allTips = response.data || [];
      // API already returns published tips only
      setTips(allTips);
    } catch (err) {
      console.error('Error fetching health tips:', err);
      setError(err.response?.data?.message || 'Failed to load health tips');
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tipId) => {
    try {
      await healthTipAPI.like(tipId);
      
      // Update UI optimistically
      setTips(prevTips => 
        prevTips.map(tip => {
          if (tip._id === tipId) {
            const userId = getUserId();
            const isLiked = tip.likedBy?.some(id => id === userId || id._id === userId);
            return {
              ...tip,
              likes: isLiked ? tip.likes - 1 : tip.likes + 1,
              likedBy: isLiked 
                ? tip.likedBy.filter(id => id !== userId && id._id !== userId)
                : [...(tip.likedBy || []), userId]
            };
          }
          return tip;
        })
      );
      
      setSuccessMessage('✅ Thank you for your feedback!');
      setTimeout(() => setSuccessMessage(''), 2000);
      
      // Refresh to get accurate data
      await fetchHealthTips();
    } catch (err) {
      console.error('Error liking tip:', err);
      setError(err.response?.data?.message || '❌ Failed to update like. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const isLikedByUser = (tip) => {
    const userId = getUserId();
    return tip.likedBy?.some(id => id === userId || id._id === userId);
  };

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
              <h1 className="text-4xl font-bold text-white">💡 Health Tips</h1>
              <p className="text-cyan-100 mt-1">Expert health and wellness advice</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-cyan-900 border-l-4 border-cyan-500 text-cyan-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="text-cyan-200 hover:text-cyan-100 font-bold">
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-xl text-gray-300">⏳ Loading health tips...</p>
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-gray-300 text-lg font-semibold">No health tips available yet</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for expert health advice from our administrators!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div 
                key={tip._id} 
                className="bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-cyan-500"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">💡</div>
                  <h3 className="text-xl font-bold text-cyan-100 flex-1">
                    {tip.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-5 leading-relaxed text-sm">
                  {tip.content}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                  <button
                    onClick={() => handleLike(tip._id)}
                    className={`flex items-center gap-2 transition-all duration-200 font-semibold text-lg ${
                      isLikedByUser(tip)
                        ? 'text-red-400'
                        : 'text-gray-400 hover:text-red-300'
                    }`}
                  >
                    <span className="text-2xl">
                      {isLikedByUser(tip) ? '❤️' : '🤍'}
                    </span>
                    <span>
                      {tip.likes || 0}
                    </span>
                  </button>
                  
                  <div className="text-xs text-cyan-200 bg-cyan-900/50 px-3 py-1 rounded-full border border-cyan-500/30">
                    ✨ By Admin
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthTips;
