import { useEffect } from 'react';
import { TileType } from '../../types';
import { cn } from '../../utils/cn';
import { useGame } from '../../context/GameContext';
import { GhostIcon } from '../icons/GhostIcon'; 
import { Food2D } from '../Game/Foods/Food2D';

interface BoardProps {
  isMinimap?: boolean;
}
const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

export const Board = ({ isMinimap = false }: BoardProps) => {
  const { playerPos, ghostsPos, layout, movePlayer } = useGame(); 

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

  const cellSize = isMinimap ? 10 : 28; 

  return (
    <div className="relative flex justify-center">
      <div
        className={cn(
          "grid rounded-lg transition-all duration-300",
          isMinimap 
            ? "border-2 border-white/30 bg-black/80 shadow-none gap-px" 
            : "border-4 shadow-[0_0_30px_var(--wall-color)] bg-(--game-bg) border-(--wall-color) gap-px"
        )}
        style={{
          gridTemplateColumns: `repeat(${layout[0].length}, ${cellSize}px)`,
        }}
      >
        {layout.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const isPlayerHere = playerPos.x === colIndex && playerPos.z === rowIndex;
            const ghostIndex = ghostsPos.findIndex(g => g.x === colIndex && g.z === rowIndex);
            const isGhostHere = ghostIndex !== -1;

            const isStrawberry = tile === TileType.STRAWBERRY;
            const isCherry = tile === TileType.CHERRY;
            const isPower = tile === TileType.POWER_PELLET;
            const isFood = tile === TileType.FOOD;
            let foodSize = 0;
            if (isStrawberry || isCherry) foodSize = isMinimap ? cellSize : 20;
            if (isPower) foodSize = isMinimap ? cellSize : 16;
            if (isFood) foodSize = isMinimap ? cellSize : 28;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{ width: cellSize, height: cellSize }}
                className={cn(
                  "flex items-center justify-center relative", 
                  tile === TileType.WALL && (isMinimap 
                    ? "bg-blue-500/50" 
                    : "bg-(--wall-color) opacity-60 rounded-xs"
                  ),
                  isPlayerHere && "bg-yellow-400 rounded-full z-10 scale-90 shadow-[0_0_10px_yellow]",
                )}
              >
                {/* --- UNIVERSAL FOOD RENDER (Minimap & Main) --- */}
                {!isPlayerHere && !isGhostHere && (
                    <>
                        {isStrawberry ? <Food2D type="strawberry" size={foodSize} /> :
                         isCherry ? <Food2D type="cherry" size={foodSize} /> :
                         isPower ? <Food2D type="power" size={foodSize} /> :
                         isFood ? <Food2D type="dot" size={foodSize} /> : null
                        }
                    </>
                )}

                {/* --- GHOST ICON --- */}
                {isGhostHere && (
                  <GhostIcon 
                    color={GHOST_COLORS[ghostIndex % GHOST_COLORS.length]}
                    className={cn(
                      "z-20 animate-bounce drop-shadow-md",
                      isMinimap ? "w-2 h-2" : "w-6 h-6" 
                    )}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};