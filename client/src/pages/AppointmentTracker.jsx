import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { isAuthenticated, clearAuthData } from '../utils/auth';
import Alert from '../components/Alert';

const AppointmentTracker = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    doctorName: '',
    hospitalName: '',
    appointmentDate: '',
    appointmentTime: '',
    ampm: 'AM',
  });

  const [errors, setErrors] = useState({});

  // Request notification permission and fetch appointments
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchAppointments();
  }, [navigate]);


  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await appointmentAPI.getAll();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to fetch appointments.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errorMessage) {
      setErrorMessage('');
    }
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Appointment time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Combine time with AM/PM
      const fullTime = formData.appointmentTime + ' ' + formData.ampm;
      
      await appointmentAPI.add({
        ...formData,
        appointmentTime: fullTime,
      });

      setSuccessMessage('✅ Appointment scheduled successfully! You will receive alerts at the scheduled time.');
      setFormData({
        doctorName: '',
        hospitalName: '',
        appointmentDate: '',
        appointmentTime: '',
        ampm: 'AM',
      });
      setErrors({});

      await fetchAppointments();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error adding appointment:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to add appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await appointmentAPI.delete(appointmentId);
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      setSuccessMessage('Appointment deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete appointment. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📅 Appointment Tracker</h1>
            <p className="text-cyan-100 mt-1">Schedule and track your doctor appointments</p>
          </div>
          <button 
            onClick={() => navigate('/user-dashboard')} 
            className="bg-white text-cyan-700 px-6 py-2 rounded-lg hover:bg-cyan-50 transition-all duration-200 font-semibold shadow-md"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Alert />

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
              <span className="font-semibold">{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="text-red-200 hover:text-red-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Notification Permission Notice */}
        {'Notification' in window && Notification.permission === 'default' && (
          <div className="bg-cyan-900/30 border border-cyan-500 text-cyan-200 px-4 py-3 rounded-lg mb-6">
            <p>💡 Enable browser notifications to receive appointment reminders!</p>
            <button 
              onClick={() => Notification.requestPermission()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Enable Notifications
            </button>
          </div>
        )}

        {/* Add Appointment Form */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-cyan-600">
          <h2 className="text-2xl font-bold mb-6 text-white">📋 Schedule New Appointment</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Doctor Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-500"
                placeholder="e.g., Dr. John Smith"
              />
              {errors.doctorName && (
                <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-500"
                placeholder="e.g., City General Hospital"
              />
              {errors.hospitalName && (
                <p className="text-red-500 text-sm mt-1">{errors.hospitalName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [color-scheme:dark]"
                style={{colorScheme: 'dark'}}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  AM/PM
                </label>
                <select
                  name="ampm"
                  value={formData.ampm}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            {errors.appointmentTime && (
              <p className="text-red-500 text-sm">{errors.appointmentTime}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '⏳ Scheduling...' : '+ Schedule Appointment'}
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-8 border-t-4 border-cyan-600">
          <h2 className="text-2xl font-bold mb-6 text-white">
            👨‍⚕️ Your Appointments ({appointments.length})
          </h2>

          {loading && appointments.length === 0 ? (
            <p className="text-center text-slate-300 py-8">⏳ Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-slate-300 text-lg font-semibold">No appointments scheduled yet</p>
              <p className="text-slate-400 text-sm mt-2">Schedule your first appointment above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-slate-900 border-l-4 border-cyan-600 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white mb-2">
                        👨‍⚕️ Dr. {appointment.doctorName}
                      </h3>
                      <div className="space-y-1 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">🏥</span> <strong>Hospital:</strong> {appointment.hospitalName}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">📆</span> <strong>Date:</strong> {formatDate(appointment.appointmentDate)}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">⏰</span> <strong>Time:</strong> {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      🗑️ Delete
                    </button>
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

export default AppointmentTracker;
