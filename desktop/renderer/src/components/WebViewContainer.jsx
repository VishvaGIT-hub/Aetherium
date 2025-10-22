import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/theme-store';
import { useTabStore } from '../store/tab-store';

export default function WebViewContainer() {
  const theme = useThemeStore(state => state.theme);
  const { tabs, activeTabId, updateTab } = useTabStore();
  const webviewRefs = useRef({});

  useEffect(() => {
    // Setup webview event listeners for each tab
    tabs.forEach(tab => {
      const webview = webviewRefs.current[tab.id];
      if (!webview) return;

      // Navigation events
      webview.addEventListener('did-start-loading', () => {
        updateTab(tab.id, { loading: true });
      });

      webview.addEventListener('did-stop-loading', () => {
        updateTab(tab.id, { loading: false });
      });

      webview.addEventListener('page-title-updated', (e) => {
        updateTab(tab.id, { title: e.title });
      });

      webview.addEventListener('page-favicon-updated', (e) => {
        updateTab(tab.id, { favicon: e.favicons[0] });
      });

      webview.addEventListener('did-navigate', (e) => {
        updateTab(tab.id, { 
          url: e.url,
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward()
        });
      });

      webview.addEventListener('did-navigate-in-page', (e) => {
        updateTab(tab.id, { url: e.url });
      });

      // New window handling
      webview.addEventListener('new-window', (e) => {
        // Open in new tab
        useTabStore.getState().createTab(e.url);
      });
    });
  }, [tabs]);

  if (!theme) return null;

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      backgroundColor: theme.colors.bgPrimary,
      overflow: 'hidden'
    }}>
      {tabs.map(tab => (
        <webview
          key={tab.id}
          ref={el => webviewRefs.current[tab.id] = el}
          src={tab.url}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: tab.id === activeTabId ? 'block' : 'none'
          }}
          allowpopups="true"
          webpreferences="contextIsolation=yes, nodeIntegration=no"
        />
      ))}

      {/* Loading indicator */}
      {tabs.find(t => t.id === activeTabId)?.loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: theme.colors.accentBlue,
          animation: 'loading 1s ease-in-out infinite'
        }} />
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
