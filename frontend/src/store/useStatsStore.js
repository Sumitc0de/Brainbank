import { create } from 'zustand';
import * as api from '../api/ideaApi';

const useStatsStore = create((set) => ({
  stats: null,
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getStats();
      set({ stats: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default useStatsStore;
