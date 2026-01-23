import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext, defaultSettings } from './ThemeContext';
import type { ThemeSettings } from '../types';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--wall-color', settings.wallColor);
    root.style.setProperty('--food-color', settings.foodColor);
    root.style.setProperty('--game-bg', settings.gameBg);

    if (settings.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = (key: keyof ThemeSettings, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetTheme = () => setSettings(defaultSettings);

  return (
    <ThemeContext.Provider value={{ settings, updateSetting, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};