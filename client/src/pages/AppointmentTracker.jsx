import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const AppointmentTracker = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      setErrorMessage('Failed to fetch appointments');
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
      await appointmentAPI.addAppointment(formData);

      setSuccessMessage('Saved Successfully');
      setFormData({
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',
      });

      // Refresh appointments list
      await fetchAppointments();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add appointment');
      setTimeout(() => setErrorMessage(''), 3000);
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
      await appointmentAPI.deleteAppointment(appointmentId);
      setSuccessMessage('Appointment deleted successfully');
      await fetchAppointments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to delete appointment');
      setTimeout(() => setErrorMessage(''), 3000);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Appointment Tracker</h1>

        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {errorMessage && (
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Add Appointment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule New Appointment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Doctor Name"
              type="text"
              name="doctorName"
              placeholder="e.g., Dr. John Smith"
              value={formData.doctorName}
              onChange={handleChange}
              error={errors.doctorName}
              required
            />

            <Input
              label="Appointment Date"
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              error={errors.appointmentDate}
              required
            />

            <Input
              label="Appointment Time"
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              error={errors.appointmentTime}
              required
            />

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Appointments ({appointments.length})
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No appointments scheduled yet. Schedule one to get reminders!
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Dr. {appointment.doctorName}
                    </h3>
                    <p className="text-gray-600">
                      {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate('/user-dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AppointmentTracker;
