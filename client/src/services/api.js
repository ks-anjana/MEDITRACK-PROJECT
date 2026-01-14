import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔵 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    // Log the error details
    if (error.response) {
      console.error(`❌ API Error Response: ${error.response.status} - ${error.config.url}`);
      console.error('Error data:', error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('❌ Route not found on backend:', error.config.url);
      }
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
      console.error(
        "Make sure backend server is reachable (Render in production, localhost in dev)"
      );
      
    } else {
      console.error('❌ Error setting up Request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => {
    console.log('📤 Registering user:', { ...data, password: '***' });
    return api.post('/auth/register', data);
  },
  login: (data) => {
    console.log('📤 Logging in user:', { email: data.email, password: '***' });
    return api.post('/auth/login', data);
  },
  testConnection: () => {
    console.log('🔍 Testing auth connection...');
    return api.get('/auth/test');
  },
};

// Admin API
export const adminAPI = {
  login: (data) => api.post('/auth/login', data),
  getDashboard: () => api.get('/users/admin/stats'),
  getHealthTips: () => api.get('/health-tips'),
  postHealthTip: (data) => api.post('/health-tips', data),
  getFeedbacks: () => api.get('/feedback'),
};

// Medicine API
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  add: (data) => api.post('/medicines', data),
  delete: (id) => api.delete(`/medicines/${id}`),
  checkAlerts: () => api.get('/medicines/alerts/check'),
};

// Appointment API
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  add: (data) => api.post('/appointments', data),
  delete: (id) => api.delete(`/appointments/${id}`),
  checkAlerts: () => api.get('/appointments/alerts/check'),
};

// Prescription API
export const prescriptionAPI = {
  getAll: () => api.get('/prescriptions'),
  upload: (formData) => {
    return api.post('/prescriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// Health Tips API
export const healthTipAPI = {
  getAll: () => api.get('/health-tips'),
  add: (data) => api.post('/health-tips', data),
  update: (id, data) => api.put(`/health-tips/${id}`, data),
  delete: (id) => api.delete(`/health-tips/${id}`),
  like: (id) => api.post(`/health-tips/${id}/like`),
};

// Advertisement API
export const advertisementAPI = {
  getAll: () => api.get('/advertisements'),
  add: (data) => api.post('/advertisements', data),
  delete: (id) => api.delete(`/advertisements/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  submit: (data) => api.post('/feedback', data),
  delete: (id) => api.delete(`/feedback/${id}`),
  reply: (id, data) => api.post(`/feedback/${id}/reply`, data),
  deleteReply: (id) => api.delete(`/feedback/${id}/reply`),
};

// User API
export const userAPI = {
  deleteAccount: () => api.delete('/users/me'),
  getAdminStats: () => api.get('/users/admin/stats'),
};

// Notification API (FCM)
export const notificationAPI = {
  registerToken: (data) => api.post('/notifications/token', data),
  send: (data) => api.post('/notifications/send', data),
};

export default api;
