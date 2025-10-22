import { create } from 'zustand';

const THEME_MODES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto',
  DESKTOP: 'desktop'
};

export const useThemeStore = create((set, get) => ({
  mode: THEME_MODES.DARK,
  theme: null,
  
  initializeTheme: async () => {
    const mode = await window.aetherium.theme.getMode();
    const theme = await window.aetherium.theme.getCurrent();
    set({ mode, theme });
  },

  setMode: async (mode) => {
    await window.aetherium.theme.setMode(mode);
    set({ mode });
  },

  subscribeToThemeChanges: () => {
    window.aetherium.theme.onThemeChange((theme) => {
      set({ theme });
    });

    window.aetherium.theme.onSystemThemeChange((isDark) => {
      if (get().mode === THEME_MODES.DESKTOP) {
        // Theme will auto-update via onThemeChange
      }
    });
  },

  getTheme: () => get().theme,
  getMode: () => get().mode
}));
