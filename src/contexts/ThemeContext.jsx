import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('geovision-theme');
    if (saved) {
      return saved === 'dark';
    }
    return false; // Default to light mode instead of OS preference
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark', 'theme-dark');
      localStorage.setItem('geovision-theme', 'dark');
    } else {
      root.classList.remove('dark', 'theme-dark');
      localStorage.setItem('geovision-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (mode) => {
    if (mode === 'dark') {
      setIsDarkMode(true);
    } else if (mode === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode((prev) => !prev);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
