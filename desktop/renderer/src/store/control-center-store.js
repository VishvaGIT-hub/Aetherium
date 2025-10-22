import { create } from 'zustand';

export const useControlCenterStore = create((set) => ({
  isOpen: false,
  activePanel: null,

  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),
  close: () => set({ isOpen: false, activePanel: null })
}));
