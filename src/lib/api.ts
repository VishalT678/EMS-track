import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Hospital API
export const hospitalAPI = {
  getAll: () => api.get('/hospitals'),
  getById: (id: string) => api.get(`/hospitals/${id}`),
  create: (data: any) => api.post('/hospitals', data),
  update: (id: string, data: any) => api.put(`/hospitals/${id}`, data),
  updateBeds: (id: string, availableBeds: number) =>
    api.patch(`/hospitals/${id}/beds`, { availableBeds }),
  delete: (id: string) => api.delete(`/hospitals/${id}`),
};

// Ambulance API
export const ambulanceAPI = {
  getAll: () => api.get('/ambulances'),
  getById: (id: string) => api.get(`/ambulances/${id}`),
  create: (data: any) => api.post('/ambulances', data),
  updateLocation: (id: string, location: { coordinates: [number, number] }) =>
    api.patch(`/ambulances/${id}/location`, { location }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/ambulances/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/ambulances/${id}`),
};

// Map API
export const mapAPI = {
  getNearestHospitals: (location: { coordinates: [number, number] }, maxDistance?: number) =>
    api.post('/map/nearest-hospitals', { location, maxDistance }),
  getNearestAmbulances: (location: { coordinates: [number, number] }, maxDistance?: number) =>
    api.post('/map/nearest-ambulances', { location, maxDistance }),
  getHospitalsWithBeds: (location: { coordinates: [number, number] }, maxDistance?: number, minBeds?: number) =>
    api.post('/map/hospitals-with-beds', { location, maxDistance, minBeds }),
};

export default api; 