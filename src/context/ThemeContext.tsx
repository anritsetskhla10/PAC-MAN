import { createContext, useContext } from 'react';
import type { ThemeSettings } from '../types';

export interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: (key: keyof ThemeSettings, value: string | boolean | number) => void;
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
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};