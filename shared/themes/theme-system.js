/**
 * AETHERIUM THEME SYSTEM
 * Supports: Dark, Light, Auto (Website-based), Desktop (System-based)
 */

export const THEME_MODES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto',
  DESKTOP: 'desktop'
};

export const darkTheme = {
  name: 'dark',
  colors: {
    // Backgrounds
    bgPrimary: '#1A1A1A',
    bgSecondary: '#2C2C2E',
    bgTertiary: '#3A3A3C',
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    
    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#6C6C70',
    
    // Accents
    accentBlue: '#0A84FF',
    accentPurple: '#5E5CE6',
    accentGreen: '#32D74B',
    accentAmber: '#FF9F0A',
    accentRed: '#FF453A',
    
    // UI Elements
    divider: '#48484A',
    shadow: 'rgba(0, 0, 0, 0.6)',
    
    // Tab specific
    tabActive: '#2C2C2E',
    tabInactive: 'transparent',
    tabHover: '#252525',
    tabBorder: '#0A84FF',
    
    // Input
    inputBg: '#2C2C2E',
    inputBorder: '#3A3A3C',
    inputFocus: '#0A84FF',
    
    // Special
    logoGradientStart: '#0A84FF',
    logoGradientEnd: '#5E5CE6'
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    s: '8px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  borderRadius: {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    pill: '999px'
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.5)',
    large: '0 8px 32px rgba(0, 0, 0, 0.6)'
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "SF Pro Display", Arial, sans-serif',
      serif: '"New York", "Times New Roman", serif',
      mono: '"SF Mono", "Fira Code", monospace'
    },
    fontSize: {
      tiny: '10px',
      small: '12px',
      body: '14px',
      h3: '17px',
      h2: '20px',
      h1: '24px',
      display: '32px'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8
    }
  }
};

export const lightTheme = {
  ...darkTheme,
  name: 'light',
  colors: {
    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F5F5F7',
    bgTertiary: '#E5E5EA',
    bgOverlay: 'rgba(0, 0, 0, 0.3)',
    
    // Text
    textPrimary: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    
    // Accents
    accentBlue: '#007AFF',
    accentPurple: '#5856D6',
    accentGreen: '#34C759',
    accentAmber: '#FF9500',
    accentRed: '#FF3B30',
    
    // UI Elements
    divider: '#D1D1D6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Tab specific
    tabActive: '#E5E5EA',
    tabInactive: 'transparent',
    tabHover: '#F5F5F7',
    tabBorder: '#007AFF',
    
    // Input
    inputBg: '#F5F5F7',
    inputBorder: '#D1D1D6',
    inputFocus: '#007AFF',
    
    // Special
    logoGradientStart: '#007AFF',
    logoGradientEnd: '#5856D6'
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    large: '0 8px 32px rgba(0, 0, 0, 0.16)'
  }
};

/**
 * Detect website color scheme from DOM
 */
export function detectWebsiteTheme(webContents) {
  return webContents.executeJavaScript(`
    (function() {
      // Check meta theme-color
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        const color = metaTheme.content;
        const rgb = hexToRgb(color);
        if (rgb) {
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          return brightness < 128 ? 'dark' : 'light';
        }
      }
      
      // Check color-scheme meta
      const colorScheme = document.querySelector('meta[name="color-scheme"]');
      if (colorScheme && colorScheme.content.includes('dark')) {
        return 'dark';
      }
      
      // Check computed background color of body
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const match = bodyBg.match(/\\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128 ? 'dark' : 'light';
      }
      
      // Check prefers-color-scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
      
      function hexToRgb(hex) {
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }
    })()
  `);
}

/**
 * Get system theme preference
 */
export function getSystemTheme() {
  const { nativeTheme } = require('electron');
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
}

/**
 * Theme Manager Class
 */
export class ThemeManager {
  constructor() {
    this.currentMode = THEME_MODES.DARK;
    this.currentTheme = darkTheme;
    this.listeners = [];
  }

  setMode(mode) {
    this.currentMode = mode;
    this.updateTheme();
  }

  async updateTheme(webContents = null) {
    let newTheme;

    switch (this.currentMode) {
      case THEME_MODES.DARK:
        newTheme = darkTheme;
        break;

      case THEME_MODES.LIGHT:
        newTheme = lightTheme;
        break;

      case THEME_MODES.AUTO:
        if (webContents) {
          try {
            const detectedTheme = await detectWebsiteTheme(webContents);
            newTheme = detectedTheme === 'dark' ? darkTheme : lightTheme;
          } catch (error) {
            newTheme = darkTheme; // Fallback
          }
        } else {
          newTheme = darkTheme;
        }
        break;

      case THEME_MODES.DESKTOP:
        const systemTheme = getSystemTheme();
        newTheme = systemTheme === 'dark' ? darkTheme : lightTheme;
        break;

      default:
        newTheme = darkTheme;
    }

    this.currentTheme = newTheme;
    this.notifyListeners(newTheme);
    return newTheme;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(theme) {
    this.listeners.forEach(listener => listener(theme));
  }

  getTheme() {
    return this.currentTheme;
  }

  getMode() {
    return this.currentMode;
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();
