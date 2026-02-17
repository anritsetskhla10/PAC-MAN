import { useEffect, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';

interface PowerPellet2DProps {
  size: number;
}

export const PowerPellet2D = ({ size }: PowerPellet2DProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useTheme();
  const color = settings?.foodColor ?? '#fef08a';

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <div 
        className={`w-[65%] h-[65%] rounded-full transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-70 scale-90'}`}
        style={{ 
          backgroundColor: color, 
          boxShadow: isVisible ? `0 0 15px ${color}` : 'none' 
        }} 
      />
    </div>
  );
};