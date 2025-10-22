import React from 'react';
import { useThemeStore } from '../store/theme-store';
import { Minimize, Maximize2, X } from 'lucide-react';

export default function TitleBar() {
  const theme = useThemeStore(state => state.theme);

  const handleMinimize = () => window.aetherium.window.minimize();
  const handleMaximize = () => window.aetherium.window.maximize();
  const handleClose = () => window.aetherium.window.close();

  if (!theme) return null;

  return (
    <div
      style={{
        height: '48px',
        backgroundColor: theme.colors.bgPrimary,
        borderBottom: `1px solid ${theme.colors.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        WebkitAppRegion: 'drag',
        userSelect: 'none'
      }}
    >
      {/* Left side - Logo and menu will go here */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
        {/* Aetherium Logo */}
        <div style={{
          width: '28px',
          height: '28px',
          background: `linear-gradient(135deg, ${theme.colors.logoGradientStart}, ${theme.colors.logoGradientEnd})`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          A
        </div>
      </div>

      {/* Right side - Window controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingRight: '16px',
        WebkitAppRegion: 'no-drag'
      }}>
        <button
          onClick={handleMinimize}
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
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgSecondary}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Minimize size={16} />
        </button>
        
        <button
          onClick={handleMaximize}
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
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.bgSecondary}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Maximize2 size={16} />
        </button>
        
        <button
          onClick={handleClose}
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
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.colors.accentRed;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
