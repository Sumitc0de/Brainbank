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
  themeStyle: localStorage.getItem('brainbank_theme_style') || 'sunset-quest',
  glowIntensity: Number(localStorage.getItem('brainbank_glow_intensity') || '50'),
  reduceAnimations: localStorage.getItem('brainbank_reduce_animations') === 'true',
  compactMode: localStorage.getItem('brainbank_compact_mode') === 'true',

  setThemeStyle: (style) => {
    localStorage.setItem('brainbank_theme_style', style);
    set({ themeStyle: style });
    get().syncDOM();
  },

  setGlowIntensity: (intensity) => {
    localStorage.setItem('brainbank_glow_intensity', intensity);
    set({ glowIntensity: intensity });
    get().syncDOM();
  },

  setReduceAnimations: (reduce) => {
    localStorage.setItem('brainbank_reduce_animations', reduce ? 'true' : 'false');
    set({ reduceAnimations: reduce });
    get().syncDOM();
  },

  setCompactMode: (compact) => {
    localStorage.setItem('brainbank_compact_mode', compact ? 'true' : 'false');
    set({ compactMode: compact });
  },

  syncDOM: () => {
    const { theme, themeStyle, glowIntensity, reduceAnimations } = get();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // sync theme style
    const classes = Array.from(document.documentElement.classList);
    classes.forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(`theme-${themeStyle}`);

    // sync glow intensity
    document.documentElement.style.setProperty('--glow-opacity', (glowIntensity / 100).toFixed(2));

    // sync reduce animations
    if (reduceAnimations) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
  },

  toggleTheme: (event) => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    const updateDOM = () => {
      localStorage.setItem('brainbank_theme', nextTheme);
      set({ theme: nextTheme });
      get().syncDOM();
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
