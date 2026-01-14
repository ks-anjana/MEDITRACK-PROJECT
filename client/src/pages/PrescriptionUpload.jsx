import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prescriptionAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';
import Alert from '../components/Alert';

const PrescriptionUpload = () => {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fullViewImage, setFullViewImage] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const cameraInputRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchPrescriptions();

    // Cleanup camera stream on component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionAPI.getAll();
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to fetch prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMessage('');

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Only JPG, PNG, and WEBP images are allowed');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle camera capture
  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
      setUseCamera(false);
    }
  };

  // Open camera for capture using MediaDevices API
  const handleOpenCamera = async () => {
    try {
      setErrorMessage('');
      setCameraActive(true);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Request camera access with constraints
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Set video source to stream and play
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.warn('Autoplay prevented:', err);
            // User interaction may be required - inform user
            setErrorMessage('⚠️ Please interact with the page to start video playback.');
          });
        };
        
        // Fallback play attempt
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.warn('Play failed:', err);
            });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraActive(false);
      
      // Handle different error types with user-friendly messages
      if (error.name === 'NotAllowedError') {
        setErrorMessage('❌ Camera access denied. Please enable camera permissions in your browser settings and try again.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMessage('❌ No camera device found. Please use a device with a camera or upload a file instead.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setErrorMessage('❌ Camera is in use by another application. Close other camera apps and try again.');
      } else {
        setErrorMessage('❌ Camera access error: ' + error.message + '. Please try uploading a file instead.');
      }
    }
  };

  // Capture photo from camera stream
  const handleCapturePhoto = () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        setErrorMessage('Camera not properly initialized. Please try again.');
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          // Create file from blob
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          
          // Set as selected file
          handleFileChange({ target: { files: [file] } });

          // Close camera
          handleCloseCamera();
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error capturing photo:', error);
      setErrorMessage('Failed to capture photo. Please try again.');
    }
  };

  // Close camera and stop stream
  const handleCloseCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setCameraActive(false);
      setUseCamera(false);
    } catch (error) {
      console.error('Error closing camera:', error);
      setErrorMessage('Error closing camera. Please try again.');
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select or capture a prescription image');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const formData = new FormData();
      formData.append('prescription', selectedFile);

      await prescriptionAPI.upload(formData);

      setSuccessMessage('✅ Prescription uploaded successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      setUseCamera(false);

      // Reset file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.value = '';
      }

      // Refresh list
      await fetchPrescriptions();

      setTimeout(() => setSuccessMessage(''), 5001);
    } catch (error) {
      console.error('Error uploading prescription:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete prescription
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await prescriptionAPI.delete(id);
      setPrescriptions((prev) => prev.filter((p) => p._id !== id));
      setSuccessMessage('✅ Prescription deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete prescription. Please try again.');
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
              <h1 className="text-3xl font-bold text-white">📄 Prescription Upload</h1>
              <p className="text-cyan-100 mt-1">Upload and organize your prescriptions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-cyan-900 border-l-4 border-cyan-500 text-cyan-200 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="text-cyan-200 hover:text-cyan-100 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="text-red-700 hover:text-red-900 font-bold">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border-t-4 border-cyan-500">
          <h2 className="text-2xl font-bold mb-6 text-cyan-100">📷 Upload Prescription</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Selection */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => { setUseCamera(false); setSelectedFile(null); setPreviewUrl(null); }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  !useCamera 
                    ? 'bg-cyan-600 text-white shadow-md' 
                    : 'bg-slate-900 text-gray-400 hover:bg-slate-600'
                }`}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => { setUseCamera(true); setSelectedFile(null); setPreviewUrl(null); }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  useCamera 
                    ? 'bg-cyan-600 text-white shadow-md' 
                    : 'bg-slate-900 text-gray-400 hover:bg-slate-600'
                }`}
              >
                📷 Take Photo
              </button>
            </div>

            {/* File Upload Input */}
            {!useCamera && (
              <div className="border-2 border-dashed border-cyan-500 rounded-lg p-8 text-center bg-slate-900">
                <div className="text-5xl mb-3">📁</div>
                <p className="text-gray-300 font-semibold mb-3">Upload your prescription image</p>
                <p className="text-gray-400 text-sm mb-5">JPG, PNG, or WEBP (Max 10MB)</p>
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('fileInput').click()}
                  className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold shadow-md"
                >
                  Choose File
                </button>
              </div>
            )}

            {/* Camera Input */}
            {useCamera && (
              <div className="border-2 border-dashed border-cyan-500 rounded-lg p-8 text-center bg-slate-900">
                {!cameraActive ? (
                  <>
                    <div className="text-5xl mb-3">📷</div>
                    <p className="text-gray-300 font-semibold mb-3">Take a photo of your prescription</p>
                    <p className="text-gray-400 text-sm mb-5">Your camera will open when you click the button below</p>
                    <button
                      type="button"
                      onClick={handleOpenCamera}
                      className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold shadow-md"
                    >
                      🎥 Open Camera
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <video
                        ref={videoRef}
                        className="w-full rounded-lg bg-black"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        playsInline
                        autoPlay
                        muted
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md"
                      >
                        📸 Capture Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseCamera}
                        className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md"
                      >
                        ✕ Close Camera
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-cyan-100 mb-3">Preview</h3>
                <img 
                  src={previewUrl} 
                  alt="Preview"
                  className="max-w-full h-auto max-h-96 rounded-lg shadow-md mx-auto cursor-pointer hover:opacity-90"
                  onClick={() => setFullViewImage(previewUrl)}
                />
              </div>
            )}

            {/* Submit Button */}
            {selectedFile && (
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '⏳ Uploading...' : '✅ Upload Prescription'}
              </button>
            )}
          </form>
        </div>

        {/* Prescriptions List */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-sky-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📋 Your Prescriptions ({prescriptions.length})
          </h2>

          {loading && prescriptions.length === 0 ? (
            <p className="text-center text-gray-300 py-8">⏳ Loading prescriptions...</p>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-300 text-lg font-semibold">No prescriptions uploaded yet</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first prescription above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription) => (
                <div 
                  key={prescription._id} 
                  className="bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-500"
                >
                  <div className="relative">
                    <img 
                      src={prescription.imageUrl} 
                      alt="Prescription"
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90"
                      onClick={() => setFullViewImage(prescription.imageUrl)}
                    />
                    <div className="absolute top-2 right-2 bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      📄 Prescription
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800">
                    <div className="text-xs text-cyan-300 mb-3 font-semibold">
                      📅 {new Date(prescription.uploadedAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => setFullViewImage(prescription.imageUrl)}
                      className="w-full bg-cyan-800 text-cyan-200 px-3 py-2 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold text-sm mb-2"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDelete(prescription._id)}
                      className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold text-sm"
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

      {/* Full View Modal */}
      {fullViewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setFullViewImage(null)}
        >
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFullViewImage(null)}
              className="absolute top-4 right-4 bg-gray-800 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-900 transition-all duration-200 font-semibold"
            >
              ✕ Close
            </button>
            <img 
              src={fullViewImage} 
              alt="Full View"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;
