import { createContext, useContext } from 'react';
import type { ThemeSettings } from '../types';

export interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void;
  resetTheme: () => void;
}

export const defaultSettings: ThemeSettings = {
  wallColor: '#1e3a8a',
  foodColor: '#fef08a',
  gameBg: '#000000',
  isDarkMode: true,
  is3DMode: false,
  isSpectatorMode: false,
  ghostVariant: 1, 
  ghostColor: '#FF0000',
  difficulty: 'MEDIUM',
  playerModel: 'classic',
  audio: {
    masterMuted: false,
    musicVolume: 0.5,
    sfxVolume: 1.0,
  }
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};