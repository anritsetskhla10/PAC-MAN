// --- სექციის სათაური ---
export const ShowcaseSectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 mt-6 first:mt-0">
    {title}
  </h3>
);

// --- 2D / 3D გადამრთველი ---
interface ModeToggleProps {
  is3D: boolean;
  onToggle: (val: boolean) => void;
  isDark: boolean;
}

export const ModeToggle = ({ is3D, onToggle, isDark }: ModeToggleProps) => (
  <div className={`p-1.5 rounded-xl flex shadow-inner mb-6 ${isDark ? 'bg-black/40' : 'bg-gray-200'}`}>
    <button
      onClick={() => onToggle(false)}
      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
        !is3D 
        ? 'bg-white dark:bg-gray-700 shadow text-primary' 
        : 'text-gray-500 hover:text-gray-400'
      }`}
    >
      2D FLAT
    </button>
    <button
      onClick={() => onToggle(true)}
      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
        is3D 
        ? 'bg-white dark:bg-gray-700 shadow text-primary' 
        : 'text-gray-500 hover:text-gray-400'
      }`}
    >
      3D VIEW
    </button>
  </div>
);

// --- არჩევის ღილაკი ---
interface SelectionBtnProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  color?: string; 
  isDark: boolean;
}

export const SelectionButton = ({ label, icon, isActive, onClick, color = 'blue', isDark }: SelectionBtnProps) => {
  const activeClass = isDark 
    ? `bg-${color}-600 text-white ring-2 ring-${color}-500 ring-offset-2 ring-offset-neutral-800`
    : `bg-${color}-500 text-white ring-2 ring-${color}-400 ring-offset-2 ring-offset-white`;

  const inactiveClass = isDark
    ? `bg-white/5 text-gray-400 hover:bg-white/10 ring-1 ring-white/10`
    : `bg-white text-gray-600 hover:bg-gray-50 ring-1 ring-gray-200`;

  return (
    <button
      onClick={onClick}
      className={`relative w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 outline-none ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-bold text-sm capitalize">{label}</span>
      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />}
    </button>
  );
};

// --- ფერის ასარჩევი ღილაკი ---
export const ColorButton = ({ color, isActive, onClick, isDark }: { color: string, isActive: boolean, onClick: () => void, isDark: boolean }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-full transition-transform duration-200 outline-none ${
      isActive 
        ? `scale-110 ring-2 ring-offset-2 ${isDark ? 'ring-white ring-offset-neutral-800' : 'ring-black ring-offset-white'}` 
        : 'hover:scale-105 border border-white/20'
    }`}
    style={{ backgroundColor: color }}
  />
);