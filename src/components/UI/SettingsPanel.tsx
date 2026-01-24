import { useTheme } from '../../context/ThemeContext';
import type { Difficulty } from '../../types';

export const SettingsPanel = () => {
  const { settings, updateSetting, resetTheme } = useTheme();

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-primary">Preferences</h3>
        <button 
          onClick={resetTheme}
          className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors px-3 py-1 rounded-full border border-white/10 hover:border-red-400/50"
        >
          RESET
        </button>
      </div>
      
      <div className="space-y-8">
        
        {/* --- Difficulty Section --- */}
        <Section title="Game Difficulty">
             <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => updateSetting('difficulty', level)}
                        className={`py-2.5 text-xs font-bold rounded-lg border transition-all duration-200 ${
                            settings.difficulty === level 
                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </Section>

        {/* --- Visuals Section --- */}
        <Section title="Visuals & Camera">
            <Toggle 
                label="Dark Mode" 
                isOn={settings.isDarkMode} 
                onToggle={() => updateSetting('isDarkMode', !settings.isDarkMode)} 
            />
            
            <Toggle 
                label="3D Graphics" 
                isOn={settings.is3DMode} 
                onToggle={() => updateSetting('is3DMode', !settings.is3DMode)} 
            />

            {settings.is3DMode && (
                 <div className="mt-3 p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/5 animate-fade-in">
                    <span className="text-sm text-gray-300">Camera View</span>
                    <button 
                        onClick={() => updateSetting('isSpectatorMode', !settings.isSpectatorMode)}
                        className="text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-md text-primary transition-colors border border-white/10"
                    >
                        {settings.isSpectatorMode ? "🎥 Spectator" : "👤 First Person"}
                    </button>
                </div>
            )}
        </Section>

        {/* --- Theme Colors --- */}
        <Section title="Customization">
            <div className="space-y-3">
                <ColorPicker label="Wall Color" val={settings.wallColor} onChange={(v) => updateSetting('wallColor', v)} />
                <ColorPicker label="Food Color" val={settings.foodColor} onChange={(v) => updateSetting('foodColor', v)} />
                <ColorPicker label="Background" val={settings.gameBg} onChange={(v) => updateSetting('gameBg', v)} />
            </div>
        </Section>

      </div>
    </div>
  );
};

// UI Helpers
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
        {children}
    </div>
);

const Toggle = ({ label, isOn, onToggle }: { label: string, isOn: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between cursor-pointer group py-2" onClick={onToggle}>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-gray-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
);

const ColorPicker = ({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-400">{label}</span>
    <div className="flex items-center gap-2 bg-black/20 p-1 pl-2 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
      <span className="text-[10px] font-mono text-gray-500 uppercase">{val}</span>
      <input 
        type="color" 
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
      />
    </div>
  </div>
);