import { create } from 'zustand';

const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const useTaskStore = create((set, get) => ({
  tasks: loadFromStorage('ideashub_tasks', {}),

  getTasksForIdea: (ideaId) => {
    return get().tasks[ideaId] || [];
  },

  addTask: (ideaId, task) => {
    set((state) => {
      const ideaTasks = state.tasks[ideaId] || [];
      const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title: task.title,
        description: task.description || '',
        phase: task.phase || 'mvp',
        status: 'pending',
        priority: task.priority || 'medium',
        estimatedTime: task.estimatedTime || '',
        createdAt: new Date().toISOString(),
      };
      const updated = { ...state.tasks, [ideaId]: [...ideaTasks, newTask] };
      localStorage.setItem('ideashub_tasks', JSON.stringify(updated));
      return { tasks: updated };
    });
  },

  updateTask: (ideaId, taskId, data) => {
    set((state) => {
      const ideaTasks = (state.tasks[ideaId] || []).map((t) =>
        t.id === taskId ? { ...t, ...data } : t
      );
      const updated = { ...state.tasks, [ideaId]: ideaTasks };
      localStorage.setItem('ideashub_tasks', JSON.stringify(updated));
      return { tasks: updated };
    });
  },

  toggleTask: (ideaId, taskId) => {
    set((state) => {
      const ideaTasks = (state.tasks[ideaId] || []).map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      );
      const updated = { ...state.tasks, [ideaId]: ideaTasks };
      localStorage.setItem('ideashub_tasks', JSON.stringify(updated));
      return { tasks: updated };
    });
  },

  deleteTask: (ideaId, taskId) => {
    set((state) => {
      const ideaTasks = (state.tasks[ideaId] || []).filter((t) => t.id !== taskId);
      const updated = { ...state.tasks, [ideaId]: ideaTasks };
      localStorage.setItem('ideashub_tasks', JSON.stringify(updated));
      return { tasks: updated };
    });
  },

  reorderTasks: (ideaId, phaseId, reorderedPhaseTasks) => {
    set((state) => {
      const allTasks = state.tasks[ideaId] || [];
      
      let phaseIndex = 0;
      const updatedTasks = allTasks.map((t) => {
        if (t.phase === phaseId) {
          return reorderedPhaseTasks[phaseIndex++];
        }
        return t;
      });

      const updated = { ...state.tasks, [ideaId]: updatedTasks };
      localStorage.setItem('ideashub_tasks', JSON.stringify(updated));
      return { tasks: updated };
    });
  },
}));

export default useTaskStore;
