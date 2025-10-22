import React from 'react';
import { useThemeStore } from '../store/theme-store';
import { useTabStore } from '../store/tab-store';
import { X, Plus, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TabBar() {
  const theme = useThemeStore(state => state.theme);
  const { tabs, activeTabId, activateTab, closeTab, createTab } = useTabStore();

  if (!theme) return null;

  return (
    <div style={{
      height: '40px',
      backgroundColor: theme.colors.bgPrimary,
      borderBottom: `1px solid ${theme.colors.divider}`,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px',
      gap: '4px',
      overflowX: 'auto',
      overflowY: 'hidden'
    }}>
      <AnimatePresence>
        {tabs.map(tab => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => activateTab(tab.id)}
            style={{
              minWidth: '120px',
              maxWidth: '240px',
              height: '32px',
              backgroundColor: tab.id === activeTabId ? theme.colors.tabActive : theme.colors.tabInactive,
              borderBottom: tab.id === activeTabId ? `2px solid ${theme.colors.tabBorder}` : 'none',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={e => {
              if (tab.id !== activeTabId) {
                e.currentTarget.style.backgroundColor = theme.colors.tabHover;
              }
            }}
            onMouseLeave={e => {
              if (tab.id !== activeTabId) {
                e.currentTarget.style.backgroundColor = theme.colors.tabInactive;
              }
            }}
          >
            <Globe size={14} color={theme.colors.textSecondary} />
            <span style={{
              flex: 1,
              fontSize: theme.typography.fontSize.small,
              color: tab.id === activeTabId ? theme.colors.textPrimary : theme.colors.textSecondary,
              fontWeight: tab.id === activeTabId ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {tab.title || 'New Tab'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: 'none',
                background: 'transparent',
                color: theme.colors.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: 0.7
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = theme.colors.accentRed;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.opacity = 1;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.textSecondary;
                e.currentTarget.style.opacity = 0.7;
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={() => createTab()}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          border: 'none',
          background: 'transparent',
          color: theme.colors.textSecondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgSecondary}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
