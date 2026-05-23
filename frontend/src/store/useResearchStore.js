import { create } from 'zustand';

const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const DEFAULT_CATEGORIES = [
  'Competitor Analysis',
  'Market Validation',
  'Monetization Research',
  'Pricing Research',
  'UI Inspiration',
];

const useResearchStore = create((set, get) => ({
  research: loadFromStorage('ideashub_research', {}),

  getResearchForIdea: (ideaId) => {
    return get().research[ideaId] || [];
  },

  initResearchForIdea: (ideaId) => {
    set((state) => {
      if (state.research[ideaId]?.length > 0) return state;
      const items = DEFAULT_CATEGORIES.map((category, i) => ({
        id: `r-${Date.now()}-${i}`,
        category,
        title: category,
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString(),
      }));
      const updated = { ...state.research, [ideaId]: items };
      localStorage.setItem('ideashub_research', JSON.stringify(updated));
      return { research: updated };
    });
  },

  addResearch: (ideaId, item) => {
    set((state) => {
      const items = state.research[ideaId] || [];
      const newItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title: item.title,
        category: item.category || 'Other',
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString(),
        ...item,
      };
      const updated = { ...state.research, [ideaId]: [...items, newItem] };
      localStorage.setItem('ideashub_research', JSON.stringify(updated));
      return { research: updated };
    });
  },

  updateResearch: (ideaId, itemId, data) => {
    set((state) => {
      const items = (state.research[ideaId] || []).map((r) =>
        r.id === itemId ? { ...r, ...data } : r
      );
      const updated = { ...state.research, [ideaId]: items };
      localStorage.setItem('ideashub_research', JSON.stringify(updated));
      return { research: updated };
    });
  },

  toggleResearch: (ideaId, itemId) => {
    set((state) => {
      const items = (state.research[ideaId] || []).map((r) =>
        r.id === itemId
          ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' }
          : r
      );
      const updated = { ...state.research, [ideaId]: items };
      localStorage.setItem('ideashub_research', JSON.stringify(updated));
      return { research: updated };
    });
  },

  deleteResearch: (ideaId, itemId) => {
    set((state) => {
      const items = (state.research[ideaId] || []).filter((r) => r.id !== itemId);
      const updated = { ...state.research, [ideaId]: items };
      localStorage.setItem('ideashub_research', JSON.stringify(updated));
      return { research: updated };
    });
  },
}));

export default useResearchStore;
