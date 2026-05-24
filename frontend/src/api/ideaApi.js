import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? '/ideas' : 'https://brainbank-15ff.onrender.com/ideas');

const API_ROOT_URL = API_BASE_URL.replace(/\/ideas\/?$/, '');

const getApiErrorMessage = (error) => {
  const responseError = error.response?.data?.error || error.response?.data?.message;
  if (responseError) return responseError;

  if (error.response?.status) {
    return `Request failed with status ${error.response.status}`;
  }

  return error.message || 'Request failed';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const uploadApi = axios.create({
  baseURL: `${API_ROOT_URL}/api/upload`,
  headers: { Accept: 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getApiErrorMessage(error);
    return Promise.reject(error);
  }
);

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getApiErrorMessage(error);
    return Promise.reject(error);
  }
);

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

// Media attachments
export const uploadAttachment = ({ ideaId, file, type, category, onProgress }) => {
  const formData = new FormData();
  formData.append('ideaId', ideaId);
  formData.append('category', category);
  formData.append('file', file);

  return uploadApi.post(`/${type}`, formData, {
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return;
      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  }).then(r => r.data);
};

export const deleteAttachment = (publicId) =>
  uploadApi.delete(`/${encodeURIComponent(publicId)}`).then(r => r.data);

export default api;
