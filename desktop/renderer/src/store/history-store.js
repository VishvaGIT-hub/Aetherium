import { create } from 'zustand';

export const useHistoryStore = create((set, get) => ({
  history: [],
  loading: false,

  loadHistory: async (limit = 50) => {
    set({ loading: true });
    const history = await window.aetherium.history.get(limit);
    set({ history, loading: false });
  },

  addToHistory: async (entry) => {
    const newEntry = await window.aetherium.history.add(entry);
    set(state => ({
      history: [newEntry, ...state.history].slice(0, 1000)
    }));
  },

  searchHistory: async (query) => {
    return await window.aetherium.history.search(query);
  },

  clearHistory: async () => {
    await window.aetherium.history.clear();
    set({ history: [] });
  }
}));
