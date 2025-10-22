const { ipcMain, nativeTheme, BrowserWindow } = require('electron');
const { themeManager, THEME_MODES } = require('../../shared/themes/theme-system');

function setupIpcHandlers(mainWindow, store) {
  
  // Window controls
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow.close());
  ipcMain.handle('window-is-maximized', () => mainWindow.isMaximized());

  // Theme management
  ipcMain.on('theme-set-mode', async (event, mode) => {
    store.set('themeMode', mode);
    themeManager.setMode(mode);
    
    // Get active tab's webContents for auto mode
    let webContents = null;
    if (mode === THEME_MODES.AUTO) {
      const activeTab = store.get('activeTab');
      if (activeTab && activeTab.webContentsId) {
        webContents = BrowserWindow.fromId(activeTab.webContentsId)?.webContents;
      }
    }
    
    const theme = await themeManager.updateTheme(webContents);
    mainWindow.webContents.send('theme-changed', theme);
  });

  ipcMain.handle('theme-get-mode', () => {
    return store.get('themeMode', 'dark');
  });

  ipcMain.handle('theme-get-current', () => {
    return themeManager.getTheme();
  });

  // Tab management
  const tabs = new Map();
  let tabIdCounter = 0;

  ipcMain.handle('tab-create', async (event, url = 'aetherium://newtab') => {
    const tabId = ++tabIdCounter;
    const tab = {
      id: tabId,
      url,
      title: 'New Tab',
      favicon: null,
      loading: false,
      canGoBack: false,
      canGoForward: false,
      createdAt: Date.now()
    };
    
    tabs.set(tabId, tab);
    return tab;
  });

  ipcMain.handle('tab-close', (event, tabId) => {
    tabs.delete(tabId);
    return true;
  });

  ipcMain.handle('tab-activate', (event, tabId) => {
    store.set('activeTabId', tabId);
    
    // Update theme if in auto mode
    const themeMode = store.get('themeMode');
    if (themeMode === THEME_MODES.AUTO) {
      const tab = tabs.get(tabId);
      if (tab && tab.webContentsId) {
        const webContents = BrowserWindow.fromId(tab.webContentsId)?.webContents;
        if (webContents) {
          themeManager.updateTheme(webContents).then(theme => {
            mainWindow.webContents.send('theme-changed', theme);
          });
        }
      }
    }
    
    return true;
  });

  ipcMain.handle('tab-get-all', () => {
    return Array.from(tabs.values());
  });

  ipcMain.handle('tab-update', (event, tabId, data) => {
    const tab = tabs.get(tabId);
    if (tab) {
      Object.assign(tab, data);
      tabs.set(tabId, tab);
      
      // Auto theme detection on page load
      const themeMode = store.get('themeMode');
      const activeTabId = store.get('activeTabId');
      
      if (themeMode === THEME_MODES.AUTO && tabId === activeTabId && data.loading === false) {
        if (data.webContentsId) {
          const webContents = BrowserWindow.fromId(data.webContentsId)?.webContents;
          if (webContents) {
            setTimeout(() => {
              themeManager.updateTheme(webContents).then(theme => {
                mainWindow.webContents.send('theme-changed', theme);
              });
            }, 500); // Wait for page to render
          }
        }
      }
    }
    return tab;
  });

  // Navigation
  ipcMain.on('nav-back', (event, tabId) => {
    const tab = tabs.get(tabId);
    if (tab && tab.webContents) {
      tab.webContents.goBack();
    }
  });

  ipcMain.on('nav-forward', (event, tabId) => {
    const tab = tabs.get(tabId);
    if (tab && tab.webContents) {
      tab.webContents.goForward();
    }
  });

  ipcMain.on('nav-reload', (event, tabId) => {
    const tab = tabs.get(tabId);
    if (tab && tab.webContents) {
      tab.webContents.reload();
    }
  });

  ipcMain.on('nav-stop', (event, tabId) => {
    const tab = tabs.get(tabId);
    if (tab && tab.webContents) {
      tab.webContents.stop();
    }
  });

  ipcMain.on('nav-to', (event, tabId, url) => {
    const tab = tabs.get(tabId);
    if (tab && tab.webContents) {
      tab.webContents.loadURL(url);
    }
  });

  // Bookmarks
  ipcMain.handle('bookmark-add', (event, bookmark) => {
    const bookmarks = store.get('bookmarks', []);
    const newBookmark = {
      id: Date.now().toString(),
      ...bookmark,
      createdAt: Date.now()
    };
    bookmarks.push(newBookmark);
    store.set('bookmarks', bookmarks);
    return newBookmark;
  });

  ipcMain.handle('bookmark-remove', (event, id) => {
    const bookmarks = store.get('bookmarks', []);
    const filtered = bookmarks.filter(b => b.id !== id);
    store.set('bookmarks', filtered);
    return true;
  });

  ipcMain.handle('bookmark-get-all', () => {
    return store.get('bookmarks', []);
  });

  ipcMain.handle('bookmark-search', (event, query) => {
    const bookmarks = store.get('bookmarks', []);
    return bookmarks.filter(b => 
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.url.toLowerCase().includes(query.toLowerCase())
    );
  });

  // History
  ipcMain.handle('history-add', (event, entry) => {
    const history = store.get('history', []);
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      timestamp: Date.now()
    };
    history.unshift(newEntry); // Add to beginning
    
    // Keep only last 1000 entries
    if (history.length > 1000) {
      history.pop();
    }
    
    store.set('history', history);
    return newEntry;
  });

  ipcMain.handle('history-get', (event, limit = 50) => {
    const history = store.get('history', []);
    return history.slice(0, limit);
  });

  ipcMain.handle('history-search', (event, query) => {
    const history = store.get('history', []);
    return history.filter(h =>
      h.title.toLowerCase().includes(query.toLowerCase()) ||
      h.url.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 50);
  });

  ipcMain.handle('history-clear', () => {
    store.set('history', []);
    return true;
  });

  // Settings
  ipcMain.handle('settings-get', (event, key) => {
    return store.get(`settings.${key}`);
  });

  ipcMain.handle('settings-set', (event, key, value) => {
    store.set(`settings.${key}`, value);
    return true;
  });

  ipcMain.handle('settings-get-all', () => {
    return store.get('settings');
  });

  // Privacy
  ipcMain.handle('privacy-set-mode', (event, mode) => {
    store.set('settings.privacy.mode', mode);
    return true;
  });

  ipcMain.handle('privacy-get-mode', () => {
    return store.get('settings.privacy.mode', 'protected');
  });

  ipcMain.handle('privacy-toggle-vpn', () => {
    const current = store.get('settings.privacy.vpnEnabled', false);
    store.set('settings.privacy.vpnEnabled', !current);
    return !current;
  });

  ipcMain.handle('privacy-toggle-adblock', () => {
    const current = store.get('settings.privacy.adBlockEnabled', true);
    store.set('settings.privacy.adBlockEnabled', !current);
    return !current;
  });

  ipcMain.handle('privacy-clear-cookies', async () => {
    await mainWindow.webContents.session.clearStorageData({
      storages: ['cookies']
    });
    return true;
  });

  // Workspaces
  const workspaces = new Map();
  let workspaceIdCounter = 0;

  // Initialize default workspace
  workspaces.set(1, {
    id: 1,
    name: 'Personal',
    tabs: [],
    active: true
  });

  ipcMain.handle('workspace-create', (event, name) => {
    const id = ++workspaceIdCounter;
    const workspace = {
      id,
      name,
      tabs: [],
      active: false
    };
    workspaces.set(id, workspace);
    return workspace;
  });

  ipcMain.handle('workspace-switch', (event, id) => {
    workspaces.forEach(ws => ws.active = false);
    const workspace = workspaces.get(id);
    if (workspace) {
      workspace.active = true;
      return workspace;
    }
    return null;
  });

  ipcMain.handle('workspace-get-all', () => {
    return Array.from(workspaces.values());
  });

  ipcMain.handle('workspace-delete', (event, id) => {
    if (id === 1) return false; // Can't delete default workspace
    workspaces.delete(id);
    return true;
  });

  // Notes
  ipcMain.handle('note-create', (event, note) => {
    const notes = store.get('notes', []);
    const newNote = {
      id: Date.now().toString(),
      ...note,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.push(newNote);
    store.set('notes', notes);
    return newNote;
  });

  ipcMain.handle('note-update', (event, id, noteData) => {
    const notes = store.get('notes', []);
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...noteData,
        updatedAt: Date.now()
      };
      store.set('notes', notes);
      return notes[index];
    }
    return null;
  });

  ipcMain.handle('note-delete', (event, id) => {
    const notes = store.get('notes', []);
    const filtered = notes.filter(n => n.id !== id);
    store.set('notes', filtered);
    return true;
  });

  ipcMain.handle('note-get-all', () => {
    return store.get('notes', []);
  });

  // Screenshots
  ipcMain.handle('screenshot-visible', async () => {
    const image = await mainWindow.webContents.capturePage();
    return image.toDataURL();
  });

  ipcMain.handle('screenshot-full', async () => {
    // Implement full page screenshot
    // This requires scrolling and stitching multiple captures
    return null;
  });

  // AI Assistant (Mock - integrate with actual AI service)
  ipcMain.handle('ai-query', async (event, prompt, context) => {
    // TODO: Integrate with OpenAI API or local AI model
    return {
      response: "AI response would go here. Integrate with your preferred AI service.",
      timestamp: Date.now()
    };
  });

  ipcMain.handle('ai-summarize', async (event, content) => {
    return {
      summary: "Summary would go here.",
      timestamp: Date.now()
    };
  });

  ipcMain.handle('ai-translate', async (event, text, targetLang) => {
    return {
      translated: text,
      sourceLang: 'auto',
      targetLang,
      timestamp: Date.now()
    };
  });
}

module.exports = { setupIpcHandlers };
