import { useMemo } from 'react';

interface Labadze2DProps {
  size: number;
  heading?: string; // PlayerHeading ტიპი შეგიძლია შემოიტანო თუ გინდა
}

export const Labadze2D = ({ size, heading = 'RIGHT' }: Labadze2DProps) => {
  // როტაცია მოძრაობის მიხედვით
  const rotation = useMemo(() => {
    switch (heading) {
      case 'UP': return -90;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'RIGHT': return 0;
      default: return 0;
    }
  }, [heading]);

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-md transition-transform duration-100"
        transform={`rotate(${rotation})`}
      >
        {/* 1. სახე/თავი (ყვითელი ან ხორცისფერი #FFCC80) */}
        <circle cx="50" cy="50" r="45" fill="#FFCC80" stroke="#E65100" strokeWidth="2" />

        {/* 2. თმა (აქ შეგიძლია შეცვალო ფერი და ფორმა) */}
        {/* მაგალითად: მოკლე შავი თმა */}
        <path d="M 15,35 Q 50,5 85,35" stroke="black" strokeWidth="12" strokeLinecap="round" fill="none" />
        
        {/* 3. სათვალე (თუ ლაბაძეს უკეთია, დატოვე, თუ არა - წაშალე) */}
        <g stroke="black" strokeWidth="2" fill="none">
             <circle cx="35" cy="45" r="10" fill="white" opacity="0.5" />
             <circle cx="65" cy="45" r="10" fill="white" opacity="0.5" />
             <line x1="45" y1="45" x2="55" y2="45" />
        </g>

        {/* 4. თვალები */}
        <circle cx="35" cy="45" r="3" fill="black" />
        <circle cx="65" cy="45" r="3" fill="black" />

        {/* 5. პირი (Pacman-ის სტილში ამოჭრილი) */}
        {/* ეს path ხატავს პირს, რომელიც ოდნავ ღიაა */}
        <path d="M 50,50 L 90,30 L 90,70 Z" fill="#D32F2F" />

        {/* 6. წვერი (თუ აქვს) */}
        <path d="M 30,70 Q 50,85 70,70" stroke="black" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
};