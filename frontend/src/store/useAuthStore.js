import { create } from 'zustand';
import * as authApi from '../api/authApi';

const useAuthStore = create((set, get) => ({
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
  theme: localStorage.getItem('brainbank_theme') || 'light',

  toggleTheme: (event) => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    const updateDOM = () => {
      localStorage.setItem('brainbank_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ theme: nextTheme });
    };

    if (!document.startViewTransition || !event || typeof event.clientX !== 'number') {
      updateDOM();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      updateDOM();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 380,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  },

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
