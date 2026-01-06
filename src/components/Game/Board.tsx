import { useEffect } from 'react';
import { TileType } from '../../types';
import { cn } from '../../utils/cn';
import { useGame } from '../../context/GameContext';

interface BoardProps {
  isMinimap?: boolean;
}

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
            const isGhostHere = ghostsPos.some(g => g.x === colIndex && g.z === rowIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{ width: cellSize, height: cellSize }}
                className={cn(
                  "flex items-center justify-center",
                  tile === TileType.WALL && (isMinimap 
                    ? "bg-blue-500/50" 
                    : "bg-(--wall-color) opacity-60 rounded-xs"
                  ),
                  isPlayerHere && "bg-yellow-400 rounded-full z-10 scale-90 shadow-[0_0_10px_yellow]",
                  isGhostHere && "bg-red-600 rounded-t-full z-10 scale-90 animate-bounce"
                )}
              >
                {tile === TileType.FOOD && !isPlayerHere && !isGhostHere && (
                  <div 
                    className={cn(
                      "rounded-full shadow-[0_0_5px_var(--food-color)]",
                      isMinimap ? "w-0.75 h-0.75" : "w-2 h-2"
                    )}
                    style={{ backgroundColor: 'var(--food-color)' }}
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