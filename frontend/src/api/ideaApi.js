import axios from 'axios';
import { refreshToken as refreshAuthToken } from './authApi.js';

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
  withCredentials: true,  // Send HTTP-only cookies
});

const uploadApi = axios.create({
  baseURL: `${API_ROOT_URL}/api/upload`,
  headers: { Accept: 'application/json' },
  withCredentials: true,  // Send HTTP-only cookies
});

// ── 401 interceptor with automatic token refresh ────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

function create401Interceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        // TOKEN_EXPIRED means we should try refreshing
        const code = error.response?.data?.code;
        if (code === 'TOKEN_EXPIRED' || code === 'NO_TOKEN') {
          if (isRefreshing) {
            // Queue this request until refresh completes
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => instance(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            await refreshAuthToken();
            processQueue(null);
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            // Dispatch logout event — the store will handle it
            window.dispatchEvent(new CustomEvent('brainbank:session-expired'));
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // Other 401s (INVALID_TOKEN, TOKEN_VERSION_MISMATCH) → logout immediately
        window.dispatchEvent(new CustomEvent('brainbank:session-expired'));
      }

      error.message = getApiErrorMessage(error);
      return Promise.reject(error);
    }
  );
}

create401Interceptor(api);
create401Interceptor(uploadApi);

// ── Error message interceptor for non-401 errors ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) {
      error.message = getApiErrorMessage(error);
    }
    return Promise.reject(error);
  }
);

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) {
      error.message = getApiErrorMessage(error);
    }
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
