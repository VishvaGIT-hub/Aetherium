import React, { useState } from 'react';
import { useThemeStore } from '../store/theme-store';
import { useControlCenterStore } from '../store/control-center-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Grid, Bookmark, Clock, Download, FolderOpen,
  Bot, StickyNote, Camera, Globe, BookOpen, Zap,
  Shield, Lock, Cookie, Key, Wrench, Puzzle, Settings,
  X, ChevronRight
} from 'lucide-react';

const menuItems = [
  {
    section: 'WORKSPACES',
    items: [
      { id: 'workspaces', icon: Grid, label: 'Workspaces', badge: null }
    ]
  },
  {
    section: 'ORGANIZE',
    items: [
      { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', badge: null },
      { id: 'history', icon: Clock, label: 'History', badge: null },
      { id: 'downloads', icon: Download, label: 'Downloads', badge: null },
      { id: 'collections', icon: FolderOpen, label: 'Collections', badge: null }
    ]
  },
  {
    section: 'TOOLS',
    items: [
      { id: 'ai', icon: Bot, label: 'AI Assistant', badge: null },
      { id: 'notes', icon: StickyNote, label: 'Notes', badge: null },
      { id: 'screenshot', icon: Camera, label: 'Screenshot', badge: null },
      { id: 'translate', icon: Globe, label: 'Translate', badge: null },
      { id: 'reading', icon: BookOpen, label: 'Reading Mode', badge: null },
      { id: 'quick', icon: Zap, label: 'Quick Actions', badge: 'Cmd+K' }
    ]
  },
  {
    section: 'PRIVACY',
    items: [
      { id: 'vpn', icon: Shield, label: 'VPN', badge: null, toggle: true },
      { id: 'adblock', icon: Lock, label: 'Ad Blocker', badge: null, toggle: true },
      { id: 'cookies', icon: Cookie, label: 'Cookie Manager', badge: null, toggle: true },
      { id: 'passwords', icon: Key, label: 'Passwords', badge: null }
    ]
  },
  {
    section: 'ADVANCED',
    items: [
      { id: 'devtools', icon: Wrench, label: 'Developer Tools', badge: null },
      { id: 'extensions', icon: Puzzle, label: 'Extensions', badge: null },
      { id: 'settings', icon: Settings, label: 'Settings', badge: null }
    ]
  }
];

export default function ControlCenter() {
  const theme = useThemeStore(state => state.theme);
  const { isOpen, activePanel, toggleOpen, setActivePanel } = useControlCenterStore();
  const [toggleStates, setToggleStates] = useState({
    vpn: false,
    adblock: true,
    cookies: true
  });

  if (!theme) return null;

  const handleToggle = (id) => {
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleOpen}
        style={{
          position: 'fixed',
          top: '16px',
          left: '56px',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isOpen ? theme.colors.accentBlue : 'transparent',
          color: isOpen ? '#FFFFFF' : theme.colors.textSecondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
      >
        <Menu size={18} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleOpen}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.bgOverlay,
              zIndex: 999
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100%',
              backgroundColor: theme.colors.bgSecondary,
              borderRight: `1px solid ${theme.colors.divider}`,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              height: '64px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.colors.divider}`
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.h3,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.textPrimary
              }}>
                Control Center
              </div>
              <button
                onClick={toggleOpen}
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
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 0'
            }}>
              {menuItems.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontSize: theme.typography.fontSize.tiny,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.textTertiary,
                    padding: '0 16px',
                    marginBottom: '8px',
                    letterSpacing: '0.5px'
                  }}>
                    {section.section}
                  </div>
                  
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activePanel === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.toggle) {
                            handleToggle(item.id);
                          } else {
                            setActivePanel(item.id);
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 16px',
                          border: 'none',
                          background: isActive ? theme.colors.accentBlue + '20' : 'transparent',
                          color: isActive ? theme.colors.accentBlue : theme.colors.textPrimary,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: theme.typography.fontSize.body,
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = theme.colors.bgTertiary;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <Icon size={18} />
                        <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                        
                        {item.toggle && (
                          <div style={{
                            width: '40px',
                            height: '24px',
                            borderRadius: '12px',
                            backgroundColor: toggleStates[item.id] ? theme.colors.accentGreen : theme.colors.bgTertiary,
                            position: 'relative',
                            transition: 'all 0.2s'
                          }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '10px',
                              backgroundColor: '#FFFFFF',
                              position: 'absolute',
                              top: '2px',
                              left: toggleStates[item.id] ? '18px' : '2px',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </div>
                        )}
                        
                        {item.badge && !item.toggle && (
                          <span style={{
                            fontSize: theme.typography.fontSize.tiny,
                            color: theme.colors.textTertiary,
                            backgroundColor: theme.colors.bgTertiary,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {item.badge}
                          </span>
                        )}
                        
                        {!item.toggle && !item.badge && (
                          <ChevronRight size={16} color={theme.colors.textTertiary} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
