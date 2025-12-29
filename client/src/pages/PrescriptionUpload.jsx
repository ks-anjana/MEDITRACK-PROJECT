import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prescriptionAPI } from '../services/api';
import Button from '../components/Button';
import Alert from '../components/Alert';

const PrescriptionUpload = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Only JPG and PNG files are allowed');
        setTimeout(() => setErrorMessage(''), 3000);
        setSelectedFile(null);
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        setTimeout(() => setErrorMessage(''), 3000);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select a file');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('prescription', selectedFile);

      await prescriptionAPI.uploadPrescription(formData);

      setSuccessMessage('Prescription uploaded successfully');
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('prescriptionInput');
      if (fileInput) {
        fileInput.value = '';
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to upload prescription');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Prescription Upload</h1>

        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {errorMessage && (
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                id="prescriptionInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="prescriptionInput"
                className="cursor-pointer"
              >
                <div className="text-4xl mb-4">📄</div>
                <p className="text-gray-800 font-medium mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-600 text-sm">
                  PNG or JPG (max 10MB)
                </p>
              </label>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Selected File:</p>
                <p className="text-blue-700">{selectedFile.name}</p>
                <p className="text-blue-600 text-sm">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full"
            >
              {loading ? 'Uploading...' : 'Upload Prescription'}
            </Button>
          </form>

          {/* Back Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/user-dashboard')}
              className="w-full"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
