import React, { useEffect, useState } from 'react';
import styles from '@/styles/DarkModeToggle.module.css';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for saved preference or system preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      const isDark = savedMode === 'true';
      setDarkMode(isDark);
      // Apply immediately to prevent flash
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.body.classList.add('dark-mode');
      }
      // Save initial preference
      localStorage.setItem('darkMode', prefersDark.toString());
    }
    setIsInitialized(true);
  }, []);

  // Apply dark mode class to body (only after initialization to prevent conflicts)
  useEffect(() => {
    if (!isInitialized) return;
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode, isInitialized]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? 'light' : 'dark'}
    </button>
  );
}