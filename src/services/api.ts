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

export default api;