import axios from 'axios';

// Get root API URL
const VITE_API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = VITE_API_URL 
  ? VITE_API_URL.replace(/\/ideas\/?$/, '/api/auth')
  : (import.meta.env.DEV ? '/api/auth' : 'https://brainbank-15ff.onrender.com/api/auth');

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,  // Send/receive HTTP-only cookies
});

export const loginWithGoogle = (token) => 
  authApi.post('/google', { token }).then((res) => res.data);

export const bypassWithMock = () => 
  authApi.post('/mock').then((res) => res.data);

export const refreshToken = () =>
  authApi.post('/refresh').then((res) => res.data);

export const getCurrentUser = () =>
  authApi.get('/me').then((res) => res.data);

export const logoutFromServer = () =>
  authApi.post('/logout').then((res) => res.data);

export const devSetPlan = (plan) =>
  authApi.post('/dev-set-plan', { plan }).then((res) => res.data);

export default authApi;
