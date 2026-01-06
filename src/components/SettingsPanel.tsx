import { useTheme } from '../context/ThemeContext';

export const SettingsPanel = () => {
  const { settings, updateSetting, resetTheme } = useTheme();

  return (
    <div className="card-surface p-6 rounded-xl bg-bg-primary border border-border-color w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-muted">Customize Theme</h3>
        <button 
          onClick={resetTheme}
          className="text-xs text-primary hover:underline"
        >
          Reset Default
        </button>
      </div>
      
      <div className="space-y-4">
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <button 
            onClick={() => updateSetting('isDarkMode', !settings.isDarkMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <hr className="border-border-color my-4" />
       
       {/* 3D Mode Toggle */}
       <div className="flex items-center justify-between">
          <span className="text-sm font-medium">3D View</span>
          <button 
            onClick={() => updateSetting('is3DMode', !settings.is3DMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.is3DMode ? 'bg-purple-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.is3DMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <hr className="border-border-color" />

        {/* Wall Color Picker */}
        <ColorPicker 
          label="Wall Color" 
          val={settings.wallColor} 
          onChange={(v) => updateSetting('wallColor', v)} 
        />

        {/* Food Color Picker */}
        <ColorPicker 
          label="Food Color" 
          val={settings.foodColor} 
          onChange={(v) => updateSetting('foodColor', v)} 
        />

        {/* Game Background Picker */}
        <ColorPicker 
          label="Board Background" 
          val={settings.gameBg} 
          onChange={(v) => updateSetting('gameBg', v)} 
        />

      </div>
    </div>
  );
};

const ColorPicker = ({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm">{label}</label>
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted uppercase">{val}</span>
      <input 
        type="color" 
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent border-0 w-8 h-8 p-0"
      />
    </div>
  </div>
);