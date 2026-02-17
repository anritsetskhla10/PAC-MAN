import { useEffect, useState } from 'react';

interface Kebab2DProps {
  size: number;
}

export const Kebab2D = ({ size }: Kebab2DProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // ციმციმის ეფექტი
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const opacity = isVisible ? 1 : 0.5;

  return (
    <div 
      style={{ width: size, height: size, opacity }} 
      className="flex items-center justify-center transition-opacity duration-200"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" transform="rotate(-45)">
        {/* შამფური */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#A9A9A9" strokeWidth="4" />
        
        {/* ხორცი */}
        <rect x="35" y="20" width="30" height="60" rx="10" fill="#8B4513" stroke="#5D4037" strokeWidth="2" />
        
        {/* გრილის ზოლები */}
        <path d="M35,35 L65,40" stroke="#3E200A" strokeWidth="2" opacity="0.6" />
        <path d="M35,50 L65,55" stroke="#3E200A" strokeWidth="2" opacity="0.6" />
        <path d="M35,65 L65,70" stroke="#3E200A" strokeWidth="2" opacity="0.6" />
      </svg>
    </div>
  );
};