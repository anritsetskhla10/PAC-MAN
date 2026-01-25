import { useMemo } from 'react';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';

interface Pacman2DProps {
  size: number;
  heading?: PlayerHeading;
}

export const Pacman2D = ({ size, heading = 'RIGHT' }: Pacman2DProps) => {
  const duration = "0.25s";

  const rotationTransform = useMemo(() => {
    switch (heading) {
      case 'UP': return 'rotate(-90deg)';
      case 'DOWN': return 'rotate(90deg)';
      case 'LEFT': return 'rotate(180deg)';
      case 'RIGHT': return 'rotate(0deg)';
      default: return 'rotate(0deg)';
    }
  }, [heading]);

  return (
    <div 
      style={{ 
        width: size, 
        height: size,
        transform: rotationTransform,
        transformOrigin: 'center center'
      }} 
      className="relative z-20 transition-transform duration-150 ease-linear"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path fill="#FFD700">
          <animate 
            attributeName="d" 
            values="
              M50 50 L100 50 A50 50 0 1 1 100 49.9 Z;
              M50 50 L85 85 A50 50 0 1 1 85 15 Z;
              M50 50 L100 50 A50 50 0 1 1 100 49.9 Z
            "
            dur={duration}
            repeatCount="indefinite"
            keyTimes="0; 0.5; 1"
            calcMode="discrete" 
          />
        </path>
      </svg>
    </div>
  );
};