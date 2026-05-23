import axios from 'axios';

const api = axios.create({
  baseURL: '/ideas',
  headers: { 'Content-Type': 'application/json' },
});

// Ideas CRUD
export const getAll = () => api.get('/').then(r => r.data);
export const getById = (id) => api.get(`/${id}`).then(r => r.data);
export const create = (data) => api.post('/', data).then(r => r.data);
export const update = (id, data) => api.put(`/${id}`, data).then(r => r.data);
export const remove = (id) => api.delete(`/${id}`).then(r => r.data);

// Status (drag & drop)
export const updateStatus = (id, status) =>
  api.patch('/status', { id, status }).then(r => r.data);

// PRD
export const generatePrd = (id) =>
  api.post(`/${id}/generate-prd`).then(r => r.data);
export const updatePrdSection = (id, section, content) =>
  api.patch(`/${id}/prd`, { section, content }).then(r => r.data);
export const regeneratePrdSection = (id, section) =>
  api.post(`/${id}/regenerate`, { section }).then(r => r.data);

// Stats & Stale
export const getStats = () => api.get('/stats').then(r => r.data);
export const getStale = () => api.get('/stale').then(r => r.data);

export default api;
