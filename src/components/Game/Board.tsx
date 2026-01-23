import { useEffect, useState } from 'react';
import { TileType, GhostState } from '../../types';
import { cn } from '../../utils/cn';
import { useGame } from '../../context/GameContext';
import { GhostIcon } from '../icons/GhostIcon'; 
import { EyesIcon } from '../icons/EyesIcon'; 
import { Food2D } from '../Game/Foods/Food2D';
import { Pacman2D } from '../Game/Player/Pacman2D';

interface BoardProps {
  isMinimap?: boolean;
}
const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

export const Board = ({ isMinimap = false }: BoardProps) => {
  const { playerPos, ghostsPos, layout, movePlayer } = useGame(); 
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMinimap) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = playerPos.x;
      let newZ = playerPos.z;
      if (e.key === 'ArrowUp' || e.key === 'w') newZ -= 1;
      if (e.key === 'ArrowDown' || e.key === 's') newZ += 1;
      if (e.key === 'ArrowLeft' || e.key === 'a') newX -= 1;
      if (e.key === 'ArrowRight' || e.key === 'd') newX += 1;
      movePlayer(newX, newZ);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, movePlayer, isMinimap]); 

  let cellSize = 28;
  if (isMinimap) {
    cellSize = isMobile ? 6 : 10;
  } else {
    cellSize = isMobile ? 18 : 28; 
  }

  return (
    <div className="relative flex justify-center">
      <div
        className={cn(
          "grid rounded-lg transition-all duration-300",
          isMinimap 
            ? "border-2 border-white/30 bg-black/80 shadow-none gap-[0.5px]" 
            : "border-0 bg-(--game-bg) gap-px" 
        )}
        style={{
          gridTemplateColumns: `repeat(${layout[0].length}, ${cellSize}px)`,
        }}
      >
        {layout.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const isPlayerHere = playerPos.x === colIndex && playerPos.z === rowIndex;
            const ghostIndex = ghostsPos.findIndex(g => Math.round(g.x) === colIndex && Math.round(g.z) === rowIndex);
            const ghost = ghostsPos[ghostIndex];
            const isGhostHere = ghostIndex !== -1;

            const isStrawberry = tile === TileType.STRAWBERRY;
            const isCherry = tile === TileType.CHERRY;
            const isPower = tile === TileType.POWER_PELLET;
            const isFood = tile === TileType.FOOD;
            
            let foodSize = 0;
            const scale = isMinimap ? 0.4 : (isMobile ? 0.6 : 1);

            if (isStrawberry || isCherry) foodSize = 20 * scale;
            if (isPower) foodSize = 16 * scale;
            if (isFood) foodSize = 8 * scale;

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
                {/* PACMAN */}
                {isPlayerHere && (
                    <div className="z-30 absolute inset-0 flex items-center justify-center">
                        <Pacman2D size={cellSize * 0.9} />
                    </div>
                )}

                {/* FOOD */}
                {!isPlayerHere && !isGhostHere && (
                    <>
                        {isStrawberry ? <Food2D type="strawberry" size={foodSize} /> :
                         isCherry ? <Food2D type="cherry" size={foodSize} /> :
                         isPower ? <Food2D type="power" size={foodSize} /> :
                         isFood ? <Food2D type="dot" size={foodSize} /> : null
                        }
                    </>
                )}

                {/* GHOST */}
                {isGhostHere && (
                  ghost.state === GhostState.EATEN ? (
                    <EyesIcon className={cn("z-20", isMinimap ? "w-2 h-2" : isMobile ? "w-4 h-4" : "w-6 h-6")} />
                  ) : (
                    <GhostIcon 
                      color={ghost.state === GhostState.SCARED ? '#0000FF' : GHOST_COLORS[ghostIndex % GHOST_COLORS.length]}
                      className={cn("z-20 animate-bounce drop-shadow-md", isMinimap ? "w-2 h-2" : isMobile ? "w-4 h-4" : "w-6 h-6")}
                    />
                  )
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};