import { useTheme } from '../context/ThemeContext';
import type { Difficulty } from '../types';

export const SettingsPanel = () => {
  const { settings, updateSetting, resetTheme } = useTheme();

  return (
    <div className="card-surface p-6 rounded-xl bg-bg-primary border border-border-color w-full max-w-md shadow-xl backdrop-blur-sm bg-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-text-main">Game Settings</h3>
        <button 
          onClick={resetTheme}
          className="text-xs text-primary hover:text-blue-400 transition-colors uppercase tracking-wider font-semibold"
        >
          Reset Default
        </button>
      </div>
      
      <div className="space-y-6">
        {/* --- DIFFICULTY --- */}
        <div className="space-y-2 pb-4 border-b border-white/10">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest pb-2">Difficulty</h4>
            <div className="flex gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => updateSetting('difficulty', level)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            settings.difficulty === level 
                            ? 'bg-primary text-black border-primary' 
                            : 'bg-transparent text-text-muted border-white/20 hover:bg-white/5'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>

        {/* --- DISPLAY --- */}
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10 pb-2">Display</h4>
            
            <Toggle 
                label="Dark Mode" 
                isOn={settings.isDarkMode} 
                onToggle={() => updateSetting('isDarkMode', !settings.isDarkMode)} 
                color="bg-primary"
            />
        
            <Toggle 
                label="3D Graphics" 
                isOn={settings.is3DMode} 
                onToggle={() => updateSetting('is3DMode', !settings.is3DMode)} 
                color="bg-purple-600"
            />

            {settings.is3DMode && (
                 <div className="flex items-center justify-between pl-4 border-l-2 border-purple-500/30">
                    <span className="text-sm font-medium text-text-muted">Camera Type</span>
                    <button 
                        onClick={() => updateSetting('isSpectatorMode', !settings.isSpectatorMode)}
                        className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white border border-white/10"
                    >
                        {settings.isSpectatorMode ? "🎥 Spectator" : "👀 First Person"}
                    </button>
                </div>
            )}
        </div>

        {/* --- COLORS --- */}
        <div className="space-y-4">
             <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest border-b border-white/10 pb-2">Theme Colors</h4>

            <ColorPicker label="Wall Color" val={settings.wallColor} onChange={(v) => updateSetting('wallColor', v)} />
            <ColorPicker label="Food Color" val={settings.foodColor} onChange={(v) => updateSetting('foodColor', v)} />
            <ColorPicker label="Background" val={settings.gameBg} onChange={(v) => updateSetting('gameBg', v)} />
        </div>

      </div>
    </div>
  );
};

const Toggle = ({ label, isOn, onToggle, color }: { label: string, isOn: boolean, onToggle: () => void, color: string }) => (
    <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
      <span className="text-sm font-medium select-none">{label}</span>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? color : 'bg-gray-600'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
);

const ColorPicker = ({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm text-gray-300">{label}</label>
    <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-lg border border-white/10">
      <span className="text-[10px] font-mono text-text-muted uppercase">{val}</span>
      <input 
        type="color" 
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent border-0 w-6 h-6 p-0 rounded overflow-hidden"
      />
    </div>
  </div>
);