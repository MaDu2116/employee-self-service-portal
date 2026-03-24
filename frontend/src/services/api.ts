import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: { email: string; password: string; fullName: string; role?: string; departmentId?: number; position?: string }) =>
    api.post('/api/auth/register', data),
};

// Profile
export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data: { phone?: string; address?: string; bankAccount?: string }) =>
    api.put('/api/profile', data),
};

// Payslips
export const payslipApi = {
  getAll: () => api.get('/api/payslips'),
  download: (id: number) =>
    api.get(`/api/payslips/${id}/download`, { responseType: 'blob' }),
  upload: (formData: FormData) =>
    api.post('/api/payslips/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Policies
export const policyApi = {
  getAll: (category?: string) =>
    api.get('/api/policies', { params: category ? { category } : {} }),
  getById: (id: number) => api.get(`/api/policies/${id}`),
  search: (q: string) => api.get('/api/policies/search', { params: { q } }),
  create: (data: { title: string; category: string; content: string }) =>
    api.post('/api/policies', data),
  update: (id: number, data: { title?: string; category?: string; content?: string }) =>
    api.put(`/api/policies/${id}`, data),
  delete: (id: number) => api.delete(`/api/policies/${id}`),
  getCategories: () => api.get('/api/policies/categories'),
};

// Requests
export const requestApi = {
  getAll: () => api.get('/api/requests'),
  create: (data: { type: string; details: string }) =>
    api.post('/api/requests', data),
  updateStatus: (id: number, data: { status: string; response?: string }) =>
    api.put(`/api/requests/${id}/status`, data),
};

// Announcements
export const announcementApi = {
  getAll: () => api.get('/api/announcements'),
  create: (data: { title: string; content: string }) =>
    api.post('/api/announcements', data),
};

// Org Chart
export const orgChartApi = {
  get: () => api.get('/api/org-chart'),
};

export default api;
