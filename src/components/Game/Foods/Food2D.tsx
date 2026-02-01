import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

interface Food2DProps {
  type: ConsumableVariant;
  size?: number; 
}

export const Food2D = ({ type, size = 100 }: Food2DProps) => {
  const [isPowerPelletVisible, setIsPowerPelletVisible] = useState(true);
  const { settings } = useTheme();
  const pelletThemeColor = settings?.foodColor ?? '#fef08a';

  useEffect(() => {
    if (type === 'power') {
      const blinkIntervalId = setInterval(() => {
        setIsPowerPelletVisible((prevVisibility) => !prevVisibility);
      }, 200);
      return () => clearInterval(blinkIntervalId);
    }
  }, [type]);

  const containerStyle = { width: size, height: size };

  if (type === 'dot') {
    return (
      <div style={containerStyle} className="flex items-center justify-center">
        <div className="w-[25%] h-[25%] rounded-sm shadow-sm transition-colors duration-300" style={{ backgroundColor: pelletThemeColor }}/>
      </div>
    );
  }

  if (type === 'power') {
    return (
      <div style={containerStyle} className="flex items-center justify-center">
        <div 
          className={`w-[65%] h-[65%] rounded-full transition-all duration-200 ${isPowerPelletVisible ? 'opacity-100 scale-100' : 'opacity-70 scale-90'}`}
          style={{ backgroundColor: pelletThemeColor, boxShadow: isPowerPelletVisible ? `0 0 15px ${pelletThemeColor}` : 'none' }} 
        />
      </div>
    );
  }

  if (type === 'cherry') {
    return (
      <svg style={containerStyle} viewBox="0 0 100 100" fill="none">
        <path d="M50 15 Q 65 40 75 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 15 Q 35 40 25 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="15" r="3" fill="#4d7c0f" />
        <circle cx="25" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="18" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 18 65)" /> 
        <circle cx="75" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="68" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 68 65)" /> 
        <path d="M50 15 C 60 5, 75 15, 70 25 C 65 35, 55 25, 50 15" fill="#65a30d"/>
      </svg>
    );
  }

  if (type === 'strawberry') {
    return (
      <svg style={containerStyle} viewBox="0 0 100 100" fill="none">
        <path d="M50 95 C 20 70, 5 50, 15 30 C 20 20, 35 20, 50 35 C 65 20, 80 20, 85 30 C 95 50, 80 70, 50 95 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="30" cy="40" r="1.5" fill="#fef08a" /><circle cx="45" cy="45" r="1.5" fill="#fef08a" /><circle cx="70" cy="40" r="1.5" fill="#fef08a" />
        <circle cx="25" cy="55" r="1.5" fill="#fef08a" /><circle cx="50" cy="65" r="1.5" fill="#fef08a" /><circle cx="75" cy="55" r="1.5" fill="#fef08a" />
        <circle cx="40" cy="80" r="1.5" fill="#fef08a" /><circle cx="60" cy="80" r="1.5" fill="#fef08a" />
        <path d="M50 35 L 40 20 L 25 25 L 35 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 60 20 L 75 25 L 65 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 50 15 L 45 25 L 55 25 L 50 15 Z" fill="#22c55e" />
      </svg>
    );
  }

  if (type === 'life') {
    return (
      <svg style={containerStyle} viewBox="0 0 100 100" fill="none" className="drop-shadow-lg animate-pulse">
         <path 
           d="M50 88.9 L44.2 83.6 C23.6 64.9 10 52.6 10 37.5 C10 25.2 19.7 15.5 32 15.5 C38.9 15.5 45.6 18.7 50 23.8 C54.4 18.7 61.1 15.5 68 15.5 C80.3 15.5 90 25.2 90 37.5 C90 52.6 76.4 64.9 55.8 83.6 L50 88.9Z" 
           fill="#ec4899" 
           stroke="#be185d" 
           strokeWidth="3"
         />
         <ellipse cx="30" cy="30" rx="8" ry="4" fill="white" fillOpacity="0.4" transform="rotate(-30 30 30)" />
      </svg>
    );
  }

  return null;
};