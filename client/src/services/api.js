import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (name, email, password, role) =>
    API.post('/auth/register', { name, email, password, role }),
  login: (email, password, role) =>
    API.post('/auth/login', { email, password, role }),
  getProfile: () => API.get('/auth/profile'),
};

// Medicine API
export const medicineAPI = {
  addMedicine: (medicineData) =>
    API.post('/medicine', medicineData),
  getMedicines: () =>
    API.get('/medicine'),
  deleteMedicine: (medicineId) =>
    API.delete(`/medicine/${medicineId}`),
};

// Appointment API
export const appointmentAPI = {
  addAppointment: (appointmentData) =>
    API.post('/appointment', appointmentData),
  getAppointments: () =>
    API.get('/appointment'),
  deleteAppointment: (appointmentId) =>
    API.delete(`/appointment/${appointmentId}`),
};

// Prescription API
export const prescriptionAPI = {
  uploadPrescription: (formData) =>
    API.post('/prescription/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getPrescriptions: () =>
    API.get('/prescription'),
  deletePrescription: (prescriptionId) =>
    API.delete(`/prescription/${prescriptionId}`),
};

// Admin API
export const adminAPI = {
  createHealthTip: (tipData) =>
    API.post('/admin/health-tips', tipData),
  getHealthTips: () =>
    API.get('/admin/health-tips'),
  seedHealthTips: () =>
    API.post('/admin/seed-health-tips'),
};

export default API;
