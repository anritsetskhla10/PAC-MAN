import React from 'react';

// --- WRAPPER FOR SECTIONS ---
export const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 pl-1">{title}</h4>
        {children}
    </div>
);

// --- TOGGLE SWITCH ---
export const ToggleSwitch = ({ label, isOn, onToggle }: { label: string, isOn: boolean, onToggle: () => void }) => (
    <div 
      className="flex items-center justify-between cursor-pointer group py-3 select-none border-b border-border-color/30 last:border-0" 
      onClick={onToggle}
    >
      <span className="text-base font-medium text-text-main transition-colors">
        {label}
      </span>
      {/* Track */}
      <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-black/10 dark:bg-white/10'}`}>
        {/* Knob */}
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
);
// --- RANGE SLIDER ---
interface RangeSliderProps {
    label: string;
    value: number; 
    onChange: (val: number) => void;
    disabled?: boolean;
}

export const RangeSlider = ({ label, value, onChange, disabled = false }: RangeSliderProps) => (
    <div className={`py-3 border-b border-border-color/30 last:border-0 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-text-main">{label}</span>
            <span className="text-xs font-mono font-bold text-primary">{Math.round(value * 100)}%</span>
        </div>
        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{ 
                backgroundSize: `${value * 100}% 100%` 
            }} 
            className="w-full h-2 rounded-lg appearance-none cursor-pointer 
                       bg-black/10 dark:bg-white/10 
                       accent-primary hover:accent-primary-hover focus:outline-none 
                       bg-linear-to-r from-primary to-primary bg-no-repeat"
        />
    </div>
);

// --- DIFFICULTY BUTTON ---
export const DifficultyButton = ({ level, isActive, onClick }: { level: string, isActive: boolean, onClick: () => void }) => (
  <button
      onClick={onClick}
      className={`py-3 px-4 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all duration-200 uppercase tracking-wide ${
          isActive 
          ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,212,255,0.4)] scale-105' 
          : 'bg-transparent text-text-muted border-border-color/30 hover:border-text-muted hover:text-text-main'
      }`}
  >
      {level}
  </button>
);

// --- COLOR SWATCHES ---
interface ColorSwatchProps {
  label: string;
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export const ColorSwatchGroup = ({ label, colors, selectedColor, onSelect }: ColorSwatchProps) => {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <span className="text-sm text-text-main font-medium pl-1">{label}</span>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 outline-none ${
                 isSelected 
                   ? 'border-text-main scale-115 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-bg-main' 
                   : 'border-transparent hover:scale-110 hover:border-text-muted/50'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {isSelected && (
                <span className="w-full h-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};