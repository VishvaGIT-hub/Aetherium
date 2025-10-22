const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { createMainWindow } = require('./browser-window');
const { setupIpcHandlers } = require('./ipc-handlers');
const { setupMenu } = require('./menu');

// Initialize persistent storage
const store = new Store({
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    themeMode: 'dark',
    tabs: [],
    bookmarks: [],
    history: [],
    settings: {
      privacy: {
        mode: 'protected',
        vpnEnabled: false,
        adBlockEnabled: true,
        trackerBlockEnabled: true,
        cookieAutoDelete: false
      },
      appearance: {
        themeMode: 'dark',
        verticalTabs: false,
        compactMode: false
      },
      advanced: {
        hardwareAcceleration: true,
        bandwidthSaver: false,
        tabSleeping: true
      }
    }
  }
});

let mainWindow;

// App ready
app.whenReady().then(() => {
  mainWindow = createMainWindow(store);
  setupIpcHandlers(mainWindow, store);
  setupMenu(mainWindow);

  // Listen for system theme changes (for Desktop mode)
  nativeTheme.on('updated', () => {
    const themeMode = store.get('themeMode');
    if (themeMode === 'desktop') {
      mainWindow.webContents.send('system-theme-changed', nativeTheme.shouldUseDarkColors);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow(store);
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  // Save state before quitting
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', bounds);
  }
});
