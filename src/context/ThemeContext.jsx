import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Modes: 'GATEWAY' (default), 'CORE', 'ORIGIN'
  const [currentMode, setCurrentMode] = useState('GATEWAY');

  useEffect(() => {
    const root = document.documentElement;
    
    // Reset classes/attributes
    root.removeAttribute('data-theme');
    
    // Apply theme based on mode
    switch (currentMode) {
      case 'CORE':
        root.setAttribute('data-theme', 'core');
        break;
      case 'ORIGIN':
        root.setAttribute('data-theme', 'origin');
        break;
      default:
        // Gateway doesn't need a specific data attribute, uses :root defaults
        break;
    }
  }, [currentMode]);

  const switchMode = (mode) => {
    if (['GATEWAY', 'CORE', 'ORIGIN'].includes(mode)) {
      setCurrentMode(mode);
    } else {
      console.warn(`Attempted to switch to invalid mode: ${mode}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentMode, switchMode }}>
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
