import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { medicineAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import { useNotification } from '../services/NotificationService';

const MedicineScheduler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { requestPermission } = useNotification();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    medicineName: '',
    time: '',
    period: 'AM',
    foodTiming: 'Before Food',
  });

  const [errors, setErrors] = useState({});

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
    fetchMedicines();
  }, [requestPermission]);

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineAPI.getMedicines();
      setMedicines(response.data.medicines || []);
    } catch (error) {
      setErrorMessage('Failed to fetch medicines');
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

    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
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
      await medicineAPI.addMedicine(formData);

      setSuccessMessage('Medicine added successfully');
      setFormData({
        medicineName: '',
        time: '',
        period: 'AM',
        foodTiming: 'Before Food',
      });

      // Refresh medicines list
      await fetchMedicines();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add medicine');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (medicineId) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) {
      return;
    }

    try {
      await medicineAPI.deleteMedicine(medicineId);
      setSuccessMessage('Medicine removed successfully');
      await fetchMedicines();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to delete medicine');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Medicine Scheduler</h1>
          <Button variant="danger" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </Button>
        </div>

        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {errorMessage && (
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Add Medicine Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Medicine</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Medicine Name"
                type="text"
                name="medicineName"
                placeholder="e.g., Aspirin"
                value={formData.medicineName}
                onChange={handleChange}
                error={errors.medicineName}
                required
              />

              <Input
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    AM / PM <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Food Timing <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="foodTiming"
                    value={formData.foodTiming}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Adding...' : 'Add Medicine'}
              </Button>
            </form>
          </div>
        )}

        {/* Medicines List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Medicines ({medicines.length})
          </h2>

          {medicines.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No medicines scheduled yet. Add one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {medicine.medicineName}
                    </h3>
                    <p className="text-gray-600">
                      Time: {medicine.time} {medicine.period} | {medicine.foodTiming}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(medicine._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/user-dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicineScheduler;
