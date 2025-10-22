import { create } from 'zustand';

export const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  loading: false,

  loadBookmarks: async () => {
    set({ loading: true });
    const bookmarks = await window.aetherium.bookmarks.getAll();
    set({ bookmarks, loading: false });
  },

  addBookmark: async (bookmark) => {
    const newBookmark = await window.aetherium.bookmarks.add(bookmark);
    set(state => ({ bookmarks: [...state.bookmarks, newBookmark] }));
    return newBookmark;
  },

  removeBookmark: async (id) => {
    await window.aetherium.bookmarks.remove(id);
    set(state => ({
      bookmarks: state.bookmarks.filter(b => b.id !== id)
    }));
  },

  searchBookmarks: async (query) => {
    return await window.aetherium.bookmarks.search(query);
  }
}));
