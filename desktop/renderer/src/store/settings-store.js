import { create } from 'zustand';

export const useSettingsStore = create((set, get) => ({
  settings: null,

  loadSettings: async () => {
    const settings = await window.aetherium.settings.getAll();
    set({ settings });
  },

  updateSetting: async (key, value) => {
    await window.aetherium.settings.set(key, value);
    const settings = await window.aetherium.settings.getAll();
    set({ settings });
  },

  getSetting: (key) => {
    const settings = get().settings;
    if (!settings) return null;
    
    const keys = key.split('.');
    let value = settings;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }
}));
