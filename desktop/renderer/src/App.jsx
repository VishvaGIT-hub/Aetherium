import React, { useEffect } from 'react';
import { useThemeStore } from './store/theme-store';
import { useTabStore } from './store/tab-store';
import TitleBar from './components/TitleBar';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import WebViewContainer from './components/WebViewContainer';
import ControlCenter from './components/ControlCenter';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const { theme, mode, initializeTheme, subscribeToThemeChanges } = useThemeStore();
  const { initializeTabs } = useTabStore();

  useEffect(() => {
    // Initialize app
    initializeTheme();
    initializeTabs();
    subscribeToThemeChanges();

    // Listen for keyboard shortcuts
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + T - New Tab
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        useTabStore.getState().createTab();
      }

      // Cmd/Ctrl + W - Close Tab
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        useTabStore.getState().closeTab(useTabStore.getState().activeTabId);
      }

      // Cmd/Ctrl + K - Quick Actions
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle quick actions
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider value={theme}>
      <div 
        className="app-container"
        style={{
          backgroundColor: theme.colors.bgPrimary,
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily.sans,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TitleBar />
        <TabBar />
        <AddressBar />
        <WebViewContainer />
        <ControlCenter />
      </div>
    </ThemeProvider>
  );
}

export default App;
