import { useEffect, useState } from 'react';

type FoodType = 'dot' | 'power' | 'cherry' | 'strawberry';

interface Food2DProps {
  type: FoodType;
  size?: number; 
}

export const Food2D = ({ type, size = 100 }: Food2DProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (type === 'power') {
      const interval = setInterval(() => setVisible((v) => !v), 200);
      return () => clearInterval(interval);
    }
  }, [type]);

  const style = { width: size, height: size };

  // --- DOT ---
  if (type === 'dot') {
    return (
      <div style={style} className="flex items-center justify-center">
        <div className="w-[25%] h-[25%] bg-[#fef08a] rounded-xs shadow-sm" />
      </div>
    );
  }

  // --- POWER PELLET  ---
  if (type === 'power') {
    return (
      <div style={style} className="flex items-center justify-center">
        <div 
          className={`w-[65%] h-[65%] bg-[#ffbd2e] rounded-full transition-all duration-200 ${visible ? 'opacity-100 scale-100 shadow-[0_0_15px_#ffbd2e]' : 'opacity-70 scale-90'}`} 
        />
      </div>
    );
  }

  // --- CHERRY ---
  if (type === 'cherry') {
    return (
      <svg style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* stems */}
        <path d="M50 15 Q 65 40 75 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 15 Q 35 40 25 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="15" r="3" fill="#4d7c0f" />
        
        {/* left cherry */}
        <circle cx="25" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="18" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 18 65)" /> 
        
        {/* right cherry */}
        <circle cx="75" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="68" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 68 65)" /> 
        
        {/* leaf */}
        <path d="M50 15 C 60 5, 75 15, 70 25 C 65 35, 55 25, 50 15" fill="#65a30d"/>
      </svg>
    );
  }

  // --- STRAWBERRY ---
  if (type === 'strawberry') {
    return (
      <svg style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* body*/}
        <path d="M50 95 C 20 70, 5 50, 15 30 C 20 20, 35 20, 50 35 C 65 20, 80 20, 85 30 C 95 50, 80 70, 50 95 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
        
        {/* seeds  */}
        <circle cx="30" cy="40" r="1.5" fill="#fef08a" />
        <circle cx="45" cy="45" r="1.5" fill="#fef08a" />
        <circle cx="70" cy="40" r="1.5" fill="#fef08a" />
        <circle cx="25" cy="55" r="1.5" fill="#fef08a" />
        <circle cx="50" cy="65" r="1.5" fill="#fef08a" />
        <circle cx="75" cy="55" r="1.5" fill="#fef08a" />
        <circle cx="40" cy="80" r="1.5" fill="#fef08a" />
        <circle cx="60" cy="80" r="1.5" fill="#fef08a" />

        {/* leaves */}
        <path d="M50 35 L 40 20 L 25 25 L 35 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 60 20 L 75 25 L 65 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 50 15 L 45 25 L 55 25 L 50 15 Z" fill="#22c55e" />
      </svg>
    );
  }

  return null;
};