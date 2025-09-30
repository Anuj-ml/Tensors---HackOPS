import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'dark-glow' | 'vibrant-energy' | 'blue-purple-calm';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeConfig: {
    name: string;
    description: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
    };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs = {
  'dark-glow': {
    name: 'Dark Glow',
    description: 'Immersive dark theme with glowing blue accents',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa',
      background: '#0f172a',
      surface: '#1e293b'
    }
  },
  'vibrant-energy': {
    name: 'Vibrant Energy',
    description: 'High-energy theme with complementary colors',
    colors: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      accent: '#10b981',
      background: '#1a1a2e',
      surface: '#16213e'
    }
  },
  'blue-purple-calm': {
    name: 'Blue Purple Calm',
    description: 'Sophisticated monochromatic blues and purples',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      accent: '#a78bfa',
      background: '#0f0f23',
      surface: '#1e1b4b'
    }
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark-glow');

  useEffect(() => {
    const config = themeConfigs[theme];
    const root = document.documentElement;
    
    // Apply theme-specific CSS variables
    root.style.setProperty('--theme-primary', config.colors.primary);
    root.style.setProperty('--theme-secondary', config.colors.secondary);
    root.style.setProperty('--theme-accent', config.colors.accent);
    root.style.setProperty('--theme-background', config.colors.background);
    root.style.setProperty('--theme-surface', config.colors.surface);
    
    // Update existing CSS variables based on theme
    switch (theme) {
      case 'dark-glow':
        root.style.setProperty('--background', '#0f172a');
        root.style.setProperty('--card', '#1e293b');
        root.style.setProperty('--primary', '#3b82f6');
        root.style.setProperty('--secondary', '#334155');
        root.style.setProperty('--accent', '#1e40af');
        break;
      case 'vibrant-energy':
        root.style.setProperty('--background', '#1a1a2e');
        root.style.setProperty('--card', '#16213e');
        root.style.setProperty('--primary', '#f59e0b');
        root.style.setProperty('--secondary', '#0f4c75');
        root.style.setProperty('--accent', '#ef4444');
        break;
      case 'blue-purple-calm':
        root.style.setProperty('--background', '#0f0f23');
        root.style.setProperty('--card', '#1e1b4b');
        root.style.setProperty('--primary', '#8b5cf6');
        root.style.setProperty('--secondary', '#312e81');
        root.style.setProperty('--accent', '#6366f1');
        break;
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themeConfig: themeConfigs[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}