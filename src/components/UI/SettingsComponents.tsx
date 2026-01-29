import React from 'react';

// --- WRAPPER FOR SECTIONS ---
export const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 pl-1">{title}</h4>
        {children}
    </div>
);

// --- TOGGLE SWITCH ---
export const ToggleSwitch = ({ label, isOn, onToggle }: { label: string, isOn: boolean, onToggle: () => void }) => (
    <div 
      className="flex items-center justify-between cursor-pointer group py-3 select-none border-b border-white/5 last:border-0" 
      onClick={onToggle}
    >
      <span className="text-base font-medium text-text-main transition-colors">
        {label}
      </span>
      {/* Track */}
      <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-white/10'}`}>
        {/* Knob */}
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
);

// --- DIFFICULTY BUTTON ---
export const DifficultyButton = ({ level, isActive, onClick }: { level: string, isActive: boolean, onClick: () => void }) => (
  <button
      onClick={onClick}
      className={`py-3 px-4 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all duration-200 uppercase tracking-wide ${
          isActive 
          ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,212,255,0.4)] scale-105' 
          : 'bg-transparent text-text-muted border-white/10 hover:border-white/30 hover:text-text-main'
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
                   : 'border-transparent hover:scale-110 hover:border-white/20'
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