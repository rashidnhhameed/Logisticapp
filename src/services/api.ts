import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// User Management API
export const userAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  resetPassword: (id: string, newPassword: string) => 
    api.put(`/users/${id}/reset-password`, { newPassword }),
  getSessions: (id: string) => api.get(`/users/${id}/sessions`),
  deactivateSessions: (id: string) => api.post(`/users/${id}/deactivate-sessions`),
};

// Role Management API
export const roleAPI = {
  getAll: () => api.get('/roles'),
  create: (data: any) => api.post('/roles', data),
  update: (id: string, data: any) => api.put(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
  getModules: () => api.get('/roles/modules'),
};

// Purchase Orders API
export const purchaseOrderAPI = {
  getAll: () => api.get('/purchase-orders'),
  create: (data: any) => api.post('/purchase-orders', data),
  update: (id: string, data: any) => api.put(`/purchase-orders/${id}`, data),
  delete: (id: string) => api.delete(`/purchase-orders/${id}`),
};

// RFQ API
export const rfqAPI = {
  getAll: () => api.get('/rfq'),
  create: (data: any) => api.post('/rfq', data),
  addQuote: (id: string, quote: any) => api.post(`/rfq/${id}/quotes`, quote),
  selectQuote: (id: string, quoteId: string) => 
    api.post(`/rfq/${id}/select-quote`, { quoteId }),
  delete: (id: string) => api.delete(`/rfq/${id}`),
};

// ASN API
export const asnAPI = {
  getAll: () => api.get('/asn'),
  create: (data: any) => api.post('/asn', data),
  update: (id: string, data: any) => api.put(`/asn/${id}`, data),
  delete: (id: string) => api.delete(`/asn/${id}`),
};

// Shipments API
export const shipmentAPI = {
  getAll: () => api.get('/shipments'),
  create: (data: any) => api.post('/shipments', data),
  update: (id: string, data: any) => api.put(`/shipments/${id}`, data),
  addTracking: (id: string, event: any) => api.post(`/shipments/${id}/tracking`, event),
  delete: (id: string) => api.delete(`/shipments/${id}`),
};

// Notifications API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Material Readiness API
export const materialReadinessAPI = {
  getAll: (params?: any) => api.get('/material-readiness', { params }),
  getStats: () => api.get('/material-readiness/stats'),
  updateReadiness: (id: string, data: any) => api.put(`/material-readiness/${id}/readiness`, data),
  bulkUpdate: (data: any) => api.put('/material-readiness/bulk-update', data),
  sendReminders: () => api.post('/material-readiness/send-reminders'),
};

export default api;