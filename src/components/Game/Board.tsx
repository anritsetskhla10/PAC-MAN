import { LEVEL_MAP } from '../../utils/constants';
import { TileType } from '../../types';
import { cn } from '../../utils/cn';

export const Board = () => {
  return (
    <div className="relative">
      <div
        className={cn(
          "grid rounded-lg border-4",
          "bg-(--game-bg)",
          "border-(--wall-color)",
          "shadow-[0_0_20px_var(--wall-color)]"
        )}
        style={{
          gridTemplateColumns: `repeat(${LEVEL_MAP[0].length}, 24px)`,
        }}
      >
        {LEVEL_MAP.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-6 h-6 flex items-center justify-center",

                // --- wall style ---
                tile === TileType.WALL && [
                  "bg-(--wall-color) opacity-40", 
                  "border-[0.5px] border-(--wall-color) rounded-[1px]"
                ],

                // --- Mystery Tile  ---
                tile === 5 && "bg-pink-900/20 border-pink-900/30"
              )}
            >
              {/* --- food style --- */}
              {tile === TileType.FOOD && (
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_4px_var(--food-color)]" 
                  style={{ backgroundColor: 'var(--food-color)' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};