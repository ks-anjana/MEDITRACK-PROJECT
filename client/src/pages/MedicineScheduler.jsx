import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicineAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';
import Alert from '../components/Alert';

const MedicineScheduler = () => {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    medicineName: '',
    time: '',
    ampm: 'AM',
    foodTiming: 'before food',
  });

  const [errors, setErrors] = useState({});

  // Request notification permission on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchMedicines();
  }, [navigate]);

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await medicineAPI.getAll();
      setMedicines(response.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to fetch medicines.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Combine time and AMPM for backend
      const fullTime = formData.time + ' ' + formData.ampm;
      
      await medicineAPI.add({
        medicineName: formData.medicineName,
        time: fullTime,
        foodTiming: formData.foodTiming,
      });
      
      await fetchMedicines();

      setSuccessMessage('✅ Medicine added! You\'ll receive alerts at the scheduled time.');
      setFormData({
        medicineName: '',
        time: '',
        ampm: 'AM',
        foodTiming: 'before food',
      });
      setErrors({});

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error adding medicine:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) return;

    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await medicineAPI.delete(id);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
      setSuccessMessage('✅ Medicine removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete medicine. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Global Alert Component */}
      <Alert />

      {/* Header with Back Button at TOP */}
      <header className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/user-dashboard')} 
              className="bg-white text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-50 transition-all duration-200 font-semibold mr-4"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">💊 Medicine Scheduler</h1>
              <p className="text-cyan-100 mt-1">Manage your daily medications and get timely reminders</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/30 border-l-4 border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="text-green-200 hover:text-green-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="text-red-200 hover:text-red-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Notification Permission Notice */}
        {'Notification' in window && Notification.permission === 'default' && (
          <div className="bg-cyan-900/30 border-l-4 border-cyan-500 text-cyan-200 px-4 py-3 rounded-lg mb-6 shadow-md">
            <p className="font-medium">💡 Enable browser notifications to receive medicine reminders!</p>
            <button 
              onClick={() => Notification.requestPermission()}
              className="mt-2 text-sm underline hover:no-underline font-semibold"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {/* Add Medicine Form */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-cyan-600">
          <h2 className="text-2xl font-bold mb-6 text-white">➕ Add New Medicine</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Medicine Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="e.g., Aspirin, Paracetamol"
                />
                {errors.medicineName && (
                  <p className="text-red-400 text-sm mt-1">❌ {errors.medicineName}</p>
                )}
              </div>

              {/* Time with AM/PM */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Time <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  />
                  <select
                    name="ampm"
                    value={formData.ampm}
                    onChange={handleChange}
                    className="px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all font-semibold text-white bg-slate-900"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {errors.time && (
                  <p className="text-red-400 text-sm mt-1">❌ {errors.time}</p>
                )}
              </div>
            </div>

            {/* Food Timing */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Food Timing <span className="text-red-400">*</span>
              </label>
              <select 
                name="foodTiming" 
                value={formData.foodTiming} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              >
                <option value="before food">🍽️ Before Food</option>
                <option value="after food">🍽️ After Food</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '+ Add Medicine'}
            </button>
          </form>
        </div>

        {/* Medicine List */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-sky-600">
          <h2 className="text-2xl font-bold mb-6 text-white">
            📋 Your Medicines ({medicines.length})
          </h2>

          {loading && medicines.length === 0 ? (
            <p className="text-center text-gray-300 py-8">⏳ Loading medicines...</p>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💊</div>
              <p className="text-gray-300 text-lg font-semibold">No medicines scheduled yet</p>
              <p className="text-gray-400 text-sm mt-2">Add your first medicine above to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicines.map((m) => (
                <div 
                  key={m._id} 
                  className="bg-slate-700 border border-slate-600 rounded-lg p-5 hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-2">💊 {m.medicineName}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1 bg-slate-600 px-3 py-1 rounded-lg">
                        <span className="font-semibold">⏰</span> {m.time}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-600 px-3 py-1 rounded-lg">
                        <span className="font-semibold">🍽️</span> {m.foodTiming}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold whitespace-nowrap"
                    onClick={() => handleDelete(m._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicineScheduler;