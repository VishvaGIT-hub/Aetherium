import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../store/theme-store';
import { useTabStore } from '../store/tab-store';
import { Search, Shield, Lock, Star, Settings, Moon, Sun, Monitor, Zap } from 'lucide-react';

export default function AddressBar() {
  const theme = useThemeStore(state => state.theme);
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);
  const activeTab = useTabStore(state => state.getActiveTab());
  const updateTab = useTabStore(state => state.updateTab);
  
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeTab) {
      setUrl(activeTab.url || '');
    }
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab && url) {
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('aetherium://')) {
        // Check if it's a search query or URL
        if (url.includes('.') && !url.includes(' ')) {
          finalUrl = `https://${url}`;
        } else {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
      }
      window.aetherium.navigation.navigateTo(activeTab.id, finalUrl);
      inputRef.current?.blur();
    }
  };

  if (!theme) return null;

  const THEME_MODES = {
    DARK: 'dark',
    LIGHT: 'light',
    AUTO: 'auto',
    DESKTOP: 'desktop'
  };

  const themeIcons = {
    dark: Moon,
    light: Sun,
    auto: Zap,
    desktop: Monitor
  };

  const ThemeIcon = themeIcons[mode] || Moon;

  return (
    <div style={{
      height: '64px',
      backgroundColor: theme.colors.bgPrimary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px'
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '720px',
        position: 'relative'
      }}>
        <div style={{
          height: '40px',
          backgroundColor: theme.colors.inputBg,
          border: `1px solid ${focused ? theme.colors.inputFocus : theme.colors.inputBorder}`,
          borderRadius: theme.borderRadius.pill,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          transition: 'all 0.2s',
          boxShadow: focused ? `0 0 0 3px ${theme.colors.inputFocus}20` : 'none'
        }}>
          <Search size={16} color={theme.colors.textSecondary} />
          
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search or enter address..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.body,
              fontFamily: theme.typography.fontFamily.sans
            }}
          />

          {/* Theme Mode Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: theme.colors.accentBlue,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgTertiary}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ThemeIcon size={16} />
            </button>

            {showThemeMenu && (
              <div style={{
                position: 'absolute',
                top: '36px',
                right: '0',
                backgroundColor: theme.colors.bgSecondary,
                borderRadius: theme.borderRadius.medium,
                boxShadow: theme.shadows.large,
                padding: '8px',
                minWidth: '200px',
                zIndex: 1000
              }}>
                <div style={{
                  fontSize: theme.typography.fontSize.small,
                  color: theme.colors.textSecondary,
                  padding: '8px 12px',
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  Theme Mode
                </div>

                {Object.entries(THEME_MODES).map(([key, value]) => {
                  const Icon = themeIcons[value];
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        setMode(value);
                        setShowThemeMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: mode === value ? theme.colors.accentBlue + '20' : 'transparent',
                        color: mode === value ? theme.colors.accentBlue : theme.colors.textPrimary,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: theme.typography.fontSize.body,
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => {
                        if (mode !== value) {
                          e.currentTarget.style.backgroundColor = theme.colors.bgTertiary;
                        }
                      }}
                      onMouseLeave={e => {
                        if (mode !== value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon size={16} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: theme.typography.fontWeight.medium }}>
                          {key.charAt(0) + key.slice(1).toLowerCase()}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.tiny,
                          color: theme.colors.textTertiary,
                          marginTop: '2px'
                        }}>
                          {value === 'dark' && 'Always dark theme'}
                          {value === 'light' && 'Always light theme'}
                          {value === 'auto' && 'Match website colors'}
                          {value === 'desktop' && 'Follow system theme'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy Shield */}
          <button
            type="button"
            onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: theme.colors.accentPurple,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgTertiary}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Shield size={16} />
          </button>

          {/* Bookmark */}
          <button
            type="button"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: theme.colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgTertiary}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Star size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
