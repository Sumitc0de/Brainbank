import { create } from 'zustand';
import * as api from '../api/ideaApi';

const useIdeaStore = create((set, get) => ({
  ideas: [],
  selectedIdea: null,
  searchQuery: '',
  activeView: 'dashboard',
  isLoading: false,
  error: null,
  isAddModalOpen: false,
  queueOrder: (() => {
    try {
      const saved = localStorage.getItem('brainbank_queue_order');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })(),

  // UI actions
  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
  clearSelectedIdea: () => set({ selectedIdea: null }),
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  setQueueOrder: (ids) => {
    try {
      localStorage.setItem('brainbank_queue_order', JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save queue order', e);
    }
    set({ queueOrder: ids });
  },

  // Fetch all ideas
  fetchIdeas: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getAll();
      set({ ideas: res.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Create idea
  createIdea: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.create(data);
      const newIdea = res.data;
      set((state) => ({
        ideas: [newIdea, ...state.ideas],
        isLoading: false,
        isAddModalOpen: false,
      }));
      return newIdea;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // Update idea
  updateIdea: async (id, data) => {
    try {
      const res = await api.update(id, data);
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Delete idea
  deleteIdea: async (id) => {
    try {
      await api.remove(id);
      set((state) => ({
        ideas: state.ideas.filter((i) => i.id !== id),
        selectedIdea: state.selectedIdea?.id === id ? null : state.selectedIdea,
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Update status (drag & drop) with optimistic updates
  updateIdeaStatus: async (id, status) => {
    const prevIdeas = get().ideas;

    // Optimistically update the status of the item locally
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? { ...i, status } : i)),
    }));

    try {
      const res = await api.updateStatus(id, status);
      set({ ideas: res.data || [] });
    } catch (err) {
      // Rollback on error
      set({ ideas: prevIdeas, error: err.message });
      throw err;
    }
  },

  // Generate PRD
  generatePrd: async (id) => {
    try {
      const res = await api.generatePrd(id);
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Regenerate PRD section
  regeneratePrdSection: async (id, section) => {
    try {
      const res = await api.regeneratePrdSection(id, section);
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Update PRD section
  updatePrdSection: async (id, section, content) => {
    try {
      const res = await api.updatePrdSection(id, section, content);
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Media attachments
  uploadAttachment: async ({ ideaId, file, type, category, onProgress }) => {
    try {
      const res = await api.uploadAttachment({ ideaId, file, type, category, onProgress });
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === ideaId ? updated : i)),
        selectedIdea: state.selectedIdea?.id === ideaId ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteAttachment: async (publicId) => {
    try {
      const res = await api.deleteAttachment(publicId);
      const updated = res.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === updated.id ? updated : i)),
        selectedIdea: state.selectedIdea?.id === updated.id ? updated : state.selectedIdea,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Derived getters
  getFilteredIdeas: () => {
    const { ideas, searchQuery } = get();
    if (!searchQuery.trim()) return ideas;
    const q = searchQuery.toLowerCase();
    return ideas.filter(
      (i) =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.tags?.some((t) => t.toLowerCase().includes(q))
    );
  },

  getIdeasByStatus: (status) => {
    return get().ideas.filter((i) => i.status === status);
  },

  getPriorityLabel: (score) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  },

  getQueuedIdeas: () => {
    const { ideas, queueOrder } = get();
    const allQueued = ideas.filter((i) => i.status === 'queued');
    
    // Filter queueOrder to only contain ideas that are currently 'queued'
    const validQueueOrder = queueOrder.filter((id) => allQueued.some((i) => i.id === id));
    
    // Get ideas that are not in the validQueueOrder
    const remaining = allQueued.filter((i) => !validQueueOrder.includes(i.id));
    
    // Sort remaining by scores.total descending
    remaining.sort((a, b) => {
      const scoreA = a.scores?.total ?? 0;
      const scoreB = b.scores?.total ?? 0;
      return scoreB - scoreA;
    });
    
    // Build the complete list: ordered first, then sorted remaining
    const orderedIdeas = validQueueOrder.map((id) => allQueued.find((i) => i.id === id));
    const merged = [...orderedIdeas, ...remaining];
    
    // Return top 4
    return merged.slice(0, 4);
  },
}));

export default useIdeaStore;
