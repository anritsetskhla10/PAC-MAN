import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SettingsSection, ToggleSwitch, RangeSlider, DifficultyButton, ColorSwatchGroup, LanguageSwitcher } from '../components/UI/SettingsComponents';
import type { Difficulty } from '../types';
import { useTranslation } from 'react-i18next';

const THEME_PALETTES = {
  walls: ['#1e3a8a', '#4c1d95', '#be123c', '#047857', '#c2410c'],
  food: ['#fef08a', '#fbcfe8', '#a7f3d0', '#e2e8f0', '#fb923c'],
  backgrounds: ['#000000', '#0f172a', '#1e1b4b', '#312e81']
};

export const SettingsPage = () => {
  const { settings, updateSetting, resetTheme } = useTheme();
  const { t } = useTranslation();

  const updateAudio = (key: string, val: number | boolean) => {
      const currentAudio = settings.audio || { masterMuted: false, musicVolume: 0.5, sfxVolume: 1.0 };
      updateSetting('audio', { ...currentAudio, [key]: val });
  };

  const handleThemeSwitch = (theme: 'classic' | 'labadze') => {
    updateSetting('gameTheme', theme);

    if (theme === 'labadze') {
      updateSetting('playerModel', 'avatar'); 
      updateSetting('ghostVariant', 4);      
      updateSetting('is3DMode', true);       
      updateSetting('wallColor', '#4c1d95'); 
    } else {
      updateSetting('playerModel', 'classic');
      updateSetting('ghostVariant', 1);
    }
  };

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
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between sticky top-0 bg-bg-main z-10 py-2">
                <h2 className="text-3xl font-black text-text-main">
                    {t('settings.title')}
                </h2>
                <button 
                    onClick={resetTheme}
                    className="text-xs font-bold text-red-500 hover:text-white border border-red-500/30 hover:bg-red-500 px-4 py-2 rounded-full transition-all uppercase tracking-wider"
                >
                    {t('settings.reset')}
                </button>
            </div>
            <LanguageSwitcher />
        </div>
        <SettingsSection title="Game Edition">
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleThemeSwitch('classic')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        settings.gameTheme === 'classic' 
                        ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
                        : 'border-border-color/30 bg-bg-card/30 hover:bg-bg-card/50 grayscale'
                    }`}
                >
                    <span className="text-3xl">🍒</span>
                    <span className={`font-bold ${settings.gameTheme === 'classic' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        Classic
                    </span>
                    {settings.gameTheme === 'classic' && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                </button>

                <button
                    onClick={() => handleThemeSwitch('labadze')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        settings.gameTheme === 'labadze' 
                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'border-border-color/30 bg-bg-card/30 hover:bg-bg-card/50 grayscale'
                    }`}
                >
                    <span className="text-3xl">😎</span>
                    <span className={`font-bold ${settings.gameTheme === 'labadze' ? 'text-blue-400' : 'text-gray-400'}`}>
                        Labadze
                    </span>
                    {settings.gameTheme === 'labadze' && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                {settings.gameTheme === 'labadze' 
                    ? 'Includes custom characters, 3D world & voices.' 
                    : 'Original arcade experience.'}
            </p>
        </SettingsSection>

        {/* AUDIO CONFIGURATION*/}
        <SettingsSection title={t('settings.audio')}>
             <div className="bg-bg-card rounded-2xl p-5 border border-border-color/40 shadow-sm space-y-2">
                <ToggleSwitch 
                    label={t('settings.master_sound')}
                    isOn={!settings.audio.masterMuted} 
                    onToggle={() => updateAudio('masterMuted', !settings.audio.masterMuted)} 
                />
                
                <div className={`transition-all duration-300 ${settings.audio.masterMuted ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <div className="h-px bg-border-color/30 my-3" />
                    <RangeSlider 
                        label={t('settings.music_vol')}
                        value={settings.audio.musicVolume} 
                        onChange={(v) => updateAudio('musicVolume', v)}
                    />
                    <RangeSlider 
                        label={t('settings.sfx_vol')}
                        value={settings.audio.sfxVolume} 
                        onChange={(v) => updateAudio('sfxVolume', v)}
                    />
                </div>
            </div>
        </SettingsSection>

        {/*DIFFICULTY*/}
        <SettingsSection title={t('settings.difficulty')}>
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-bg-card/50 rounded-2xl border border-border-color/40">
            {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                <DifficultyButton 
                    key={level}
                    level={t(`settings.${level.toLowerCase()}`)}
                    isActive={settings.difficulty === level}
                    onClick={() => updateSetting('difficulty', level)}
                />
            ))}
            </div>
        </SettingsSection>

        {/* GRAPHICS & CAMERA */}
        <SettingsSection title={t('settings.graphics')}>
            <div className="space-y-1">
                <ToggleSwitch 
                    label={t('settings.dark_mode')}
                    isOn={settings.isDarkMode} 
                    onToggle={() => updateSetting('isDarkMode', !settings.isDarkMode)} 
                />
                <ToggleSwitch 
                    label={t('settings.3d_graphics')}
                    isOn={settings.is3DMode} 
                    onToggle={() => updateSetting('is3DMode', !settings.is3DMode)} 
                />
            </div>

            {settings.is3DMode && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm text-primary font-bold">{t('settings.camera')}</span>
                    <button 
                        onClick={() => updateSetting('isSpectatorMode', !settings.isSpectatorMode)}
                        className="text-xs font-bold bg-primary text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                        {settings.isSpectatorMode ? `🎥 ${t('settings.overview')}` : `👤 ${t('settings.first_person')}`}
                    </button>
                </div>
            )}
        </SettingsSection>

        {/* COLORS */}
        <SettingsSection title={t('settings.customization')}>
            <div className="space-y-6">
                <ColorSwatchGroup 
                    label={t('settings.wall_color')}
                    colors={THEME_PALETTES.walls} 
                    selectedColor={settings.wallColor}
                    onSelect={(c) => updateSetting('wallColor', c)}
                />
                <ColorSwatchGroup 
                    label={t('settings.food_color')}
                    colors={THEME_PALETTES.food} 
                    selectedColor={settings.foodColor}
                    onSelect={(c) => updateSetting('foodColor', c)}
                />
                <ColorSwatchGroup 
                    label={t('settings.background')}
                    colors={THEME_PALETTES.backgrounds} 
                    selectedColor={settings.gameBg}
                    onSelect={(c) => updateSetting('gameBg', c)}
                />
            </div>
        </SettingsSection>

        <div className="h-20" />
        
      </div>
    </div>
  );
};