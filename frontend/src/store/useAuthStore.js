import { create } from 'zustand';
import * as authApi from '../api/authApi';

const useAuthStore = create((set) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('brainbank_user')) || null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('brainbank_token') || null,
  loading: false,
  error: null,

  loginWithGoogle: async (googleToken) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.loginWithGoogle(googleToken);
      const { token, user } = res;
      localStorage.setItem('brainbank_token', token);
      localStorage.setItem('brainbank_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return res;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Google Login failed.';
      set({ error: errMsg, loading: false });
      throw new Error(errMsg);
    }
  },

  bypassWithMock: async () => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.bypassWithMock();
      const { token, user } = res;
      localStorage.setItem('brainbank_token', token);
      localStorage.setItem('brainbank_user', JSON.stringify(user));
      set({ token, user, loading: false });
      return res;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Developer bypass failed.';
      set({ error: errMsg, loading: false });
      throw new Error(errMsg);
    }
  },

  logout: () => {
    localStorage.removeItem('brainbank_token');
    localStorage.removeItem('brainbank_user');
    set({ token: null, user: null, error: null });
  },
}));

export default useAuthStore;
