import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // ✅ REQUIRED for CORS
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🔵 API Request: ${(config.method || 'GET').toUpperCase()} ${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${(response.config.method || 'GET').toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ API Error ${error.response.status} → ${error.config?.url}`
      );
      console.error('Response:', error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!['/login', '/register'].includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('❌ No response from server');
      console.error('Base URL:', API_BASE_URL);
    } else {
      console.error('❌ Axios error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ===============================
// AUTH API
// ===============================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ===============================
// ADMIN API
// ===============================
export const adminAPI = {
  login: (data) => api.post('/auth/login', data),
  getDashboard: () => api.get('/users/admin/stats'),
  getHealthTips: () => api.get('/health-tips'),
  postHealthTip: (data) => api.post('/health-tips', data),
  getFeedbacks: () => api.get('/feedback'),
};

// ===============================
// MEDICINE API
// ===============================
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  add: (data) => api.post('/medicines', data),
  delete: (id) => api.delete(`/medicines/${id}`),
  checkAlerts: () => api.get('/medicines/alerts/check'),
};

// ===============================
// APPOINTMENT API
// ===============================
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  add: (data) => api.post('/appointments', data),
  delete: (id) => api.delete(`/appointments/${id}`),
  checkAlerts: () => api.get('/appointments/alerts/check'),
};

// ===============================
// PRESCRIPTION API
// ===============================
export const prescriptionAPI = {
  getAll: () => api.get('/prescriptions'),
  upload: (formData) =>
    api.post('/prescriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// ===============================
// HEALTH TIPS API
// ===============================
export const healthTipAPI = {
  getAll: () => api.get('/health-tips'),
  add: (data) => api.post('/health-tips', data),
  update: (id, data) => api.put(`/health-tips/${id}`, data),
  delete: (id) => api.delete(`/health-tips/${id}`),
  like: (id) => api.post(`/health-tips/${id}/like`),
};

// ===============================
// ADVERTISEMENT API
// ===============================
export const advertisementAPI = {
  getAll: () => api.get('/advertisements'),
  add: (data) => api.post('/advertisements', data),
  delete: (id) => api.delete(`/advertisements/${id}`),
};

// ===============================
// FEEDBACK API
// ===============================
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  submit: (data) => api.post('/feedback', data),
  delete: (id) => api.delete(`/feedback/${id}`),
  reply: (id, data) => api.post(`/feedback/${id}/reply`, data),
  deleteReply: (id) => api.delete(`/feedback/${id}/reply`),
};

// ===============================
// USER API
// ===============================
export const userAPI = {
  deleteAccount: () => api.delete('/users/me'),
  getAdminStats: () => api.get('/users/admin/stats'),
};

// ===============================
// NOTIFICATION API
// ===============================
export const notificationAPI = {
  registerToken: (data) => api.post('/notifications/token', data),
  send: (data) => api.post('/notifications/send', data),
};

export default api;
