import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SettingsSection, ToggleSwitch, RangeSlider, DifficultyButton, ColorSwatchGroup } from '../components/UI/SettingsComponents';
import type { Difficulty } from '../types';

const THEME_PALETTES = {
  walls: ['#1e3a8a', '#4c1d95', '#be123c', '#047857', '#c2410c'],
  food: ['#fef08a', '#fbcfe8', '#a7f3d0', '#e2e8f0', '#fb923c'],
  backgrounds: ['#000000', '#0f172a', '#1e1b4b', '#312e81']
};

export const SettingsPage = () => {
  const { settings, updateSetting, resetTheme } = useTheme();

  const updateAudio = (key: string, val: number | boolean) => {
      const currentAudio = settings.audio || { masterMuted: false, musicVolume: 0.5, sfxVolume: 1.0 };
      updateSetting('audio', { ...currentAudio, [key]: val });
  };

  // Dark Mode Logic
  useEffect(() => {
    const root = document.documentElement;
    if (settings.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] bg-bg-main overflow-y-auto z-0 pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      
      <div className="container mx-auto px-6 py-8 max-w-lg">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-text-main">
                Settings
            </h2>
            <button 
                onClick={resetTheme}
                className="text-xs font-bold text-red-500 hover:text-white border border-red-500/30 hover:bg-red-500 px-4 py-2 rounded-full transition-all uppercase tracking-wider"
            >
                RESET DEFAULT
            </button>
        </div>

        {/* AUDIO CONFIGURATION*/}
        <SettingsSection title="Audio Configuration">
             <div className="bg-bg-card rounded-2xl p-5 border border-border-color/40 shadow-sm space-y-2">
                <ToggleSwitch 
                    label="Master Sound" 
                    isOn={!settings.audio.masterMuted} 
                    onToggle={() => updateAudio('masterMuted', !settings.audio.masterMuted)} 
                />
                
                {/* Sliders Container */}
                <div className={`transition-all duration-300 ${settings.audio.masterMuted ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <div className="h-px bg-border-color/30 my-3" />
                    <RangeSlider 
                        label="Music Volume" 
                        value={settings.audio.musicVolume} 
                        onChange={(v) => updateAudio('musicVolume', v)}
                    />
                    <RangeSlider 
                        label="SFX Volume" 
                        value={settings.audio.sfxVolume} 
                        onChange={(v) => updateAudio('sfxVolume', v)}
                    />
                </div>
            </div>
        </SettingsSection>

        {/*DIFFICULTY*/}
        <SettingsSection title="Game Difficulty">
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-bg-card/50 rounded-2xl border border-border-color/40">
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

        {/* GRAPHICS & CAMERA */}
        <SettingsSection title="Graphics & Camera">
            <div className="space-y-1">
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
            </div>

            {/* Camera Perspective Sub-option */}
            {settings.is3DMode && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm text-primary font-bold">Camera Perspective</span>
                    <button 
                        onClick={() => updateSetting('isSpectatorMode', !settings.isSpectatorMode)}
                        className="text-xs font-bold bg-primary text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                        {settings.isSpectatorMode ? "🎥 Overview" : "👤 First Person"}
                    </button>
                </div>
            )}
        </SettingsSection>

        {/* COLORS */}
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

        {/* Bottom Spacer for Scrolling */}
        <div className="h-20" />
        
      </div>
    </div>
  );
};