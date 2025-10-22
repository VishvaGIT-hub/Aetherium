const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('aetherium', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
  },

  // Tab management
  tabs: {
    create: (url) => ipcRenderer.invoke('tab-create', url),
    close: (tabId) => ipcRenderer.invoke('tab-close', tabId),
    activate: (tabId) => ipcRenderer.invoke('tab-activate', tabId),
    getAll: () => ipcRenderer.invoke('tab-get-all'),
    update: (tabId, data) => ipcRenderer.invoke('tab-update', tabId, data)
  },

  // Navigation
  navigation: {
    goBack: (tabId) => ipcRenderer.send('nav-back', tabId),
    goForward: (tabId) => ipcRenderer.send('nav-forward', tabId),
    reload: (tabId) => ipcRenderer.send('nav-reload', tabId),
    stop: (tabId) => ipcRenderer.send('nav-stop', tabId),
    navigateTo: (tabId, url) => ipcRenderer.send('nav-to', tabId, url)
  },

  // Theme
  theme: {
    setMode: (mode) => ipcRenderer.send('theme-set-mode', mode),
    getMode: () => ipcRenderer.invoke('theme-get-mode'),
    getCurrent: () => ipcRenderer.invoke('theme-get-current'),
    onThemeChange: (callback) => {
      ipcRenderer.on('theme-changed', (_, theme) => callback(theme));
    },
    onSystemThemeChange: (callback) => {
      ipcRenderer.on('system-theme-changed', (_, isDark) => callback(isDark));
    }
  },

  // Bookmarks
  bookmarks: {
    add: (bookmark) => ipcRenderer.invoke('bookmark-add', bookmark),
    remove: (id) => ipcRenderer.invoke('bookmark-remove', id),
    getAll: () => ipcRenderer.invoke('bookmark-get-all'),
    search: (query) => ipcRenderer.invoke('bookmark-search', query)
  },

  // History
  history: {
    add: (entry) => ipcRenderer.invoke('history-add', entry),
    get: (limit) => ipcRenderer.invoke('history-get', limit),
    search: (query) => ipcRenderer.invoke('history-search', query),
    clear: () => ipcRenderer.invoke('history-clear')
  },

  // Downloads
  downloads: {
    start: (url) => ipcRenderer.invoke('download-start', url),
    getAll: () => ipcRenderer.invoke('download-get-all'),
    onProgress: (callback) => {
      ipcRenderer.on('download-progress', (_, data) => callback(data));
    }
  },

  // Settings
  settings: {
    get: (key) => ipcRenderer.invoke('settings-get', key),
    set: (key, value) => ipcRenderer.invoke('settings-set', key, value),
    getAll: () => ipcRenderer.invoke('settings-get-all')
  },

  // Privacy
  privacy: {
    setMode: (mode) => ipcRenderer.invoke('privacy-set-mode', mode),
    getMode: () => ipcRenderer.invoke('privacy-get-mode'),
    toggleVPN: () => ipcRenderer.invoke('privacy-toggle-vpn'),
    toggleAdBlock: () => ipcRenderer.invoke('privacy-toggle-adblock'),
    clearCookies: () => ipcRenderer.invoke('privacy-clear-cookies')
  },

  // Workspaces
  workspaces: {
    create: (name) => ipcRenderer.invoke('workspace-create', name),
    switch: (id) => ipcRenderer.invoke('workspace-switch', id),
    getAll: () => ipcRenderer.invoke('workspace-get-all'),
    delete: (id) => ipcRenderer.invoke('workspace-delete', id)
  },

  // AI Assistant
  ai: {
    query: (prompt, context) => ipcRenderer.invoke('ai-query', prompt, context),
    summarize: (content) => ipcRenderer.invoke('ai-summarize', content),
    translate: (text, targetLang) => ipcRenderer.invoke('ai-translate', text, targetLang)
  },

  // Notes
  notes: {
    create: (note) => ipcRenderer.invoke('note-create', note),
    update: (id, note) => ipcRenderer.invoke('note-update', id, note),
    delete: (id) => ipcRenderer.invoke('note-delete', id),
    getAll: () => ipcRenderer.invoke('note-get-all')
  },

  // Screenshots
  screenshot: {
    captureVisible: () => ipcRenderer.invoke('screenshot-visible'),
    captureFull: () => ipcRenderer.invoke('screenshot-full'),
    captureSelection: () => ipcRenderer.invoke('screenshot-selection')
  }
});
