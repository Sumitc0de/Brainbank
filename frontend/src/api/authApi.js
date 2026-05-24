import axios from 'axios';

// Get root API URL based on ideaApi pattern
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
});

export const loginWithGoogle = (token) => 
  authApi.post('/google', { token }).then((res) => res.data);

export const bypassWithMock = () => 
  authApi.post('/mock').then((res) => res.data);

export default authApi;
