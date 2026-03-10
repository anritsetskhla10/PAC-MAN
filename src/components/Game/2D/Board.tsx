import { useEffect, useState, useMemo } from 'react';
import { TileType, GhostState, type Ghost } from '../../../types';
import { cn } from '../../../utils/cn';
import { useGame } from '../../../context/GameContext';
import { useTheme } from '../../../context/ThemeContext';
import { Ghost2D } from './Ghost2D';
import { Food2D } from '../2D/Food2D';
import { Pacman2D } from '../../Game/Player/Pacman2D';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading'; 
import { debounce } from '../../../utils/debounce';

const MAP_COLS = 19;
const MAP_ROWS = 22;

interface BoardProps {
  isMinimap?: boolean;
  heading?: PlayerHeading; 
  parentWidth?: number; 
  parentHeight?: number; 
}

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

export const Board = ({ isMinimap = false, heading, parentWidth = 0, parentHeight = 0 }: BoardProps) => {
  const { playerPosRef, ghostsPosRef, layout, movePlayer, activeBonus, subscribeToPositions } = useGame(); 
  const { settings } = useTheme();
  
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  const [localPlayerPos, setLocalPlayerPos] = useState({ x: 1, z: 1 });
  const [localGhostsPos, setLocalGhostsPos] = useState<Ghost[]>([]);
  
  const [flashTick, setFlashTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlashTick(prev => !prev), 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLocalPlayerPos({ ...playerPosRef.current });
    setLocalGhostsPos([...ghostsPosRef.current]);

    return subscribeToPositions(() => {
      setLocalPlayerPos({ ...playerPosRef.current });
      setLocalGhostsPos([...ghostsPosRef.current]);
    });
  }, [subscribeToPositions, playerPosRef, ghostsPosRef]);

  useEffect(() => {
    if (!isMinimap) return;

    const handleResize = debounce(() => {
        setWindowWidth(window.innerWidth);
    }, 150);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimap]);

  useEffect(() => {
    if (isMinimap) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = playerPosRef.current.x;
      let newZ = playerPosRef.current.z;
      
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') newZ -= 1;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') newZ += 1;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') newX -= 1;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') newX += 1;
      
      movePlayer(newX, newZ);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, isMinimap, playerPosRef]); 

  const cellSize = useMemo(() => {
    if (isMinimap) {
        return windowWidth < 768 ? 8 : 12; 
    }
    if (parentWidth === 0 || parentHeight === 0) return 20;
    const sizeW = Math.floor(parentWidth / MAP_COLS);
    const sizeH = Math.floor(parentHeight / MAP_ROWS);
    const optimalSize = Math.min(sizeW, sizeH);
    return Math.max(12, Math.min(optimalSize, 85));
  }, [isMinimap, windowWidth, parentWidth, parentHeight]);

  const itemScale = cellSize / 28; 
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative flex justify-center items-center transition-all duration-300">
      <div
        className={cn(
          "grid rounded-lg transition-all duration-300",
          isMinimap 
            ? "border-2 border-white/30 bg-black/90 shadow-none gap-[0.5px]" 
            : "border-0 bg-(--game-bg) gap-px shadow-2xl" 
        )}
        style={{
          gridTemplateColumns: `repeat(${layout[0]?.length || 19}, ${cellSize}px)`,
        }}
      >
        {layout.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const isPlayerHere = localPlayerPos.x === colIndex && localPlayerPos.z === rowIndex;
            const ghostIndex = localGhostsPos.findIndex(g => Math.round(g.x) === colIndex && Math.round(g.z) === rowIndex);
            const ghost = localGhostsPos[ghostIndex];
            const isGhostHere = ghostIndex !== -1;

            const isPower = tile === TileType.POWER_PELLET;
            const isFood = tile === TileType.FOOD;
            const isBonusHere = activeBonus && activeBonus.x === colIndex && activeBonus.z === rowIndex;
            
            const scale = isMinimap ? 0.5 : (isMobile ? 0.9 : 1); 
            
            let foodSize = 0;
            if (isPower) foodSize = 16 * scale * itemScale;
            if (isFood) foodSize = 8 * scale * itemScale;
            if (isBonusHere) foodSize = 24 * scale * itemScale;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{ width: cellSize, height: cellSize }}
                className={cn(
                  "flex items-center justify-center relative", 
                  tile === TileType.WALL && (isMinimap 
                    ? "bg-blue-500/50" 
                    : "bg-(--wall-color) opacity-60 rounded-[1px]"
                  ),
                )}
              >
                {!isPlayerHere && !isGhostHere && (
                    <>
                        {isPower && <Food2D type="power" size={foodSize} />}
                        {isFood && <Food2D type="dot" size={foodSize} />}
                        {isBonusHere && activeBonus.type === 'CHERRY' && <Food2D type="cherry" size={foodSize} />}
                        {isBonusHere && activeBonus.type === 'STRAWBERRY' && <Food2D type="strawberry" size={foodSize} />}
                        {isBonusHere && activeBonus.type === 'EXTRA_LIFE' && <Food2D type="life" size={foodSize} />}
                    </>
                )}

                {isPlayerHere && (
                    <div className="z-20 absolute inset-0 flex items-center justify-center">
                        <Pacman2D size={cellSize * 0.9} heading={heading} />
                    </div>
                )}

                {isGhostHere && ghost && (() => {
                    const isFlashing = ghost.state === GhostState.FLASHING;
                    const isScaredState = ghost.state === GhostState.SCARED || isFlashing;
                    
                    let currentVariant = 1; 
                    if (ghost.state === GhostState.EATEN) {
                        currentVariant = 3; 
                    } else if (settings.gameTheme === 'labadze') {
                        const labadzeMap = [4, 5, 6, 7];
                        currentVariant = labadzeMap[ghostIndex % 4];
                    } else {
                        currentVariant = (settings.ghostVariant === 1 || settings.ghostVariant === 2) 
                            ? settings.ghostVariant 
                            : 1;
                    }

                    const isLabadzeGhost = currentVariant >= 4 && currentVariant <= 7;

                    const ghostColor = isFlashing 
                        ? (flashTick ? '#FFFFFF' : '#0000FF')
                        : (isScaredState ? '#0000FF' : GHOST_COLORS[ghostIndex % GHOST_COLORS.length]);

                    return (
                        <div className={cn(
                            "z-30 absolute inset-0 flex items-center justify-center pointer-events-none",
                            ghost.state !== GhostState.EATEN && "animate-bounce drop-shadow-md",
                            isFlashing && isLabadzeGhost && "ghost-css-flash" 
                        )}>
                            <Ghost2D 
                                variant={currentVariant} 
                                color={ghostColor} 
                                size={isMinimap ? cellSize : cellSize * 0.9} 
                                isScared={isScaredState} 
                            />
                        </div>
                    );
                })()}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};