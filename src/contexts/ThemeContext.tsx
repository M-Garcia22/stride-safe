
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ContrastMode = 'normal' | 'high';

interface ThemeContextType {
  theme: Theme;
  contrastMode: ContrastMode;
  setTheme: (theme: Theme) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleTheme: () => void;
  toggleContrastMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });
  
  const [contrastMode, setContrastMode] = useState<ContrastMode>(() => {
    const saved = localStorage.getItem('contrastMode');
    return (saved as ContrastMode) || 'normal';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('contrastMode', contrastMode);
    document.documentElement.classList.toggle('high-contrast', contrastMode === 'high');
  }, [contrastMode]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleContrastMode = () => {
    setContrastMode(prev => prev === 'normal' ? 'high' : 'normal');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      contrastMode,
      setTheme,
      setContrastMode,
      toggleTheme,
      toggleContrastMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
