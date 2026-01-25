import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { Difficulty } from '../../types';

const THEME_PALETTES = {
  walls: [
    '#1e3a8a', 
    '#4c1d95', 
    '#be123c',
    '#047857',
    '#c2410c',
  ],
  food: [
    '#fef08a',
    '#fbcfe8', 
    '#a7f3d0',
    '#e2e8f0', 
    '#fb923c', 
  ],
  backgrounds: [
    '#000000', 
    '#0f172a', 
    '#1e1b4b', 
    '#312e81', 
  ]
};

export const SettingsPanel = () => {
  const { settings, updateSetting, resetTheme } = useTheme();

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-primary">Preferences</h3>
        <button 
          onClick={resetTheme}
          className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors px-3 py-1 rounded-full border border-white/10 hover:border-red-400/50"
          title="Restore default settings"
        >
          RESET
        </button>
      </div>
      
      <div className="space-y-8">
        
        {/* Difficulty Section */}
        <SettingsSection title="Game Difficulty">
             <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                    <DifficultyButton 
                      key={level}
                      level={level}
                      isActive={settings.difficulty === level}
                      onClick={() => updateSetting('difficulty', level)}
                    />
                ))}
            </div>
        </SettingsSection>

        {/* Visuals Section */}
        <SettingsSection title="Visuals & Camera">
            <ToggleSwitch 
                label="Dark Mode" 
                isOn={settings.isDarkMode} 
                onToggle={() => updateSetting('isDarkMode', !settings.isDarkMode)} 
            />
            
            <ToggleSwitch 
                label="3D Graphics" 
                isOn={settings.is3DMode} 
                onToggle={() => updateSetting('is3DMode', !settings.is3DMode)} 
            />

            {/* Camera toggle only makes sense if we are actually in 3D mode */}
            {settings.is3DMode && (
                 <div className="mt-3 p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/5 animate-fade-in">
                    <span className="text-sm text-gray-300">Camera View</span>
                    <button 
                        onClick={() => updateSetting('isSpectatorMode', !settings.isSpectatorMode)}
                        className="text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-md text-primary transition-colors border border-white/10 shadow-sm"
                    >
                        {settings.isSpectatorMode ? "🎥 Spectator" : "👤 First Person"}
                    </button>
                </div>
            )}
        </SettingsSection>

        <SettingsSection title="Customization">
            <div className="space-y-6">
                <ColorSwatchGroup 
                  label="Wall Color" 
                  colors={THEME_PALETTES.walls} 
                  selectedColor={settings.wallColor}
                  onSelect={(c) => updateSetting('wallColor', c)}
                />

                <ColorSwatchGroup 
                  label="Food Color" 
                  colors={THEME_PALETTES.food} 
                  selectedColor={settings.foodColor}
                  onSelect={(c) => updateSetting('foodColor', c)}
                />

                <ColorSwatchGroup 
                  label="Background" 
                  colors={THEME_PALETTES.backgrounds} 
                  selectedColor={settings.gameBg}
                  onSelect={(c) => updateSetting('gameBg', c)}
                />
            </div>
        </SettingsSection>

      </div>
    </div>
  );
};

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
        {children}
    </div>
);

const ToggleSwitch = ({ label, isOn, onToggle }: { label: string, isOn: boolean, onToggle: () => void }) => (
    <div 
      className="flex items-center justify-between cursor-pointer group py-2 select-none" 
      onClick={onToggle}
    >
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-gray-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
);

// Specialized button for difficulty to reduce clutter in main component
const DifficultyButton = ({ level, isActive, onClick }: { level: string, isActive: boolean, onClick: () => void }) => (
  <button
      onClick={onClick}
      className={`py-2.5 text-xs font-bold rounded-lg border transition-all duration-200 ${
          isActive 
          ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,212,255,0.3)]' 
          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200'
      }`}
  >
      {level}
  </button>
);


interface ColorSwatchProps {
  label: string;
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorSwatchGroup = ({ label, colors, selectedColor, onSelect }: ColorSwatchProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 ${
                 isSelected 
                   ? 'border-white scale-110 shadow-md' 
                   : 'border-transparent hover:scale-105 hover:border-white/30'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {isSelected && (
                <span className="w-full h-full flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};