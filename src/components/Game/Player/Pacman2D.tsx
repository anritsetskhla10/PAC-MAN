import { useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';
import { Labadze2D } from '../2D/Characters/Labadze2D'; 
import { ClassicPacman2D } from '../2D/Characters/ClassicPacman2D';

interface Pacman2DProps {
  size: number;
  heading?: PlayerHeading;
  forceModel?: 'classic' | 'labadze'; 
}

export const Pacman2D = ({ size, heading = 'RIGHT', forceModel }: Pacman2DProps) => {
  const { settings } = useTheme();
  const activeModel = forceModel || settings.gameTheme;

  const transformStyle = useMemo(() => {
    if (activeModel === 'labadze') {
      switch (heading) {
        case 'LEFT': return 'scaleX(-1)'; 
        case 'RIGHT': return 'scaleX(1)'; 
        case 'UP': return 'scaleX(1)';    
        case 'DOWN': return 'scaleX(1)';  
        default: return 'scaleX(1)';
      }
    } else {
      switch (heading) {
        case 'UP': return 'rotate(-90deg)';
        case 'DOWN': return 'rotate(90deg)';
        case 'LEFT': return 'rotate(180deg)';
        case 'RIGHT': return 'rotate(0deg)';
        default: return 'rotate(0deg)';
      }
    }
  }, [heading, activeModel]);

  return (
    <div 
      style={{ 
        width: size, 
        height: size,
        transform: transformStyle,
        transformOrigin: 'center center'
      }} 
      className="relative z-20 transition-transform duration-150 ease-linear"
    >
      {activeModel === 'labadze' ? (
        <Labadze2D size={size} />
      ) : (
        <ClassicPacman2D/>
      )}
    </div>
  );
};