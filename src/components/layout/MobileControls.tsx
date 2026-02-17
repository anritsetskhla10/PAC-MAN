import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile } from '../../hooks/useIsMobile';

interface DPadButtonProps {
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  icon: string;
  className: string;
  onMove: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

const DPadButton = ({ dir, icon, className, onMove }: DPadButtonProps) => (
  <button
    onPointerDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onMove(dir);
    }}
    className={className}
  >
    {icon}
  </button>
);

export const MobileControls = () => {
  const { playerPos, movePlayer, gameStatus } = useGame();
  const { settings } = useTheme();
  const isMobile = useIsMobile();
  
  const playerPosRef = useRef(playerPos);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  const handleMove = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (navigator.vibrate) navigator.vibrate(15);

    let newX = playerPosRef.current.x;
    let newZ = playerPosRef.current.z;

    if (direction === 'UP') newZ -= 1;
    if (direction === 'DOWN') newZ += 1;
    if (direction === 'LEFT') newX -= 1;
    if (direction === 'RIGHT') newX += 1;

    movePlayer(newX, newZ);
  };

  if (!isMobile || gameStatus !== 'playing') return null;

  const is3DEnvironment = settings.is3DMode;

  const baseBtnClass = `
    w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl 
    text-2xl md:text-3xl font-bold transition-all duration-100 
    active:scale-90 select-none touch-none backdrop-blur-md shadow-lg
  `;

  const themeClass = is3DEnvironment
    ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30" 
    : "bg-neutral-900/90 border-2 border-primary/50 text-primary hover:bg-neutral-800 active:bg-primary/20 shadow-primary/20";

  const finalBtnClass = `${baseBtnClass} ${themeClass}`;

  return (
    <div className={`fixed z-200 bottom-6 right-6 flex flex-col items-center gap-2 touch-none select-none
       ${is3DEnvironment ? 'opacity-60 hover:opacity-100' : 'opacity-90'}
    `}>
      
      <DPadButton dir="UP" icon="▲" className={finalBtnClass} onMove={handleMove} />

      <div className="flex gap-2">
        <DPadButton dir="LEFT" icon="◀" className={finalBtnClass} onMove={handleMove} />
        <DPadButton dir="DOWN" icon="▼" className={finalBtnClass} onMove={handleMove} />
        <DPadButton dir="RIGHT" icon="▶" className={finalBtnClass} onMove={handleMove} />
      </div>

    </div>
  );
};