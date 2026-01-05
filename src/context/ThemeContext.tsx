import { createContext, useContext } from 'react';

export interface ThemeSettings {
  wallColor: string;
  foodColor: string;
  gameBg: string;
  isDarkMode: boolean;
}

export interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: (key: keyof ThemeSettings, value: string | boolean) => void;
  resetTheme: () => void;
}

export const defaultSettings: ThemeSettings = {
  wallColor: '#1e3a8a',
  foodColor: '#fef08a',
  gameBg: '#000000',
  isDarkMode: true,
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};