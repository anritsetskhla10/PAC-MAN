import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext, defaultSettings } from './ThemeContext';
import type { ThemeSettings } from '../types';

const STORAGE_KEY = 'pacman_theme_settings_v1';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return defaultSettings;
      const parsed = JSON.parse(saved);
      // Merge with defaults so settings persisted under an older schema still
      // get any newly-added fields (e.g. `audio`) instead of being undefined.
      return {
        ...defaultSettings,
        ...parsed,
        audio: { ...defaultSettings.audio, ...(parsed?.audio ?? {}) },
      };
    } catch (e) {
      console.warn('Failed to parse theme settings:', e);
      return defaultSettings;
    }
  });

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings((prev) => {
      if (key === 'audio' && typeof value === 'object') {
         return { ...prev, audio: { ...prev.audio, ...value } };
      }
      return { ...prev, [key]: value };
    });
  };

  const resetTheme = () => {
      setSettings(defaultSettings);
      localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSetting, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};