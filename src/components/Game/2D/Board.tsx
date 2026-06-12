import React, { useEffect, useState, useMemo } from 'react';
import { TileType, GhostState, type Ghost } from '../../../types';
import { cn } from '../../../utils/cn';
import { useGameRefs, useGameLayout, useGameActions } from '../../../context/GameContext';
import { useTheme } from '../../../context/ThemeContext';
import { Ghost2D } from './Ghost2D';
import { Food2D } from '../2D/Food2D';
import { Pacman2D } from '../../Game/Player/Pacman2D';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';
import type { ActiveBonus } from '../../../types';
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

/**
 * The static maze: walls and uneaten food. Memoized so that moving Pac-Man or a
 * ghost (which only updates the actor overlay) never re-renders the ~400 tiles.
 * It re-renders only when the layout itself changes (a dot eaten) or on resize.
 */
interface StaticGridProps {
  layout: number[][];
  cellSize: number;
  isMinimap: boolean;
  isMobile: boolean;
  itemScale: number;
}

const StaticGrid = React.memo(({ layout, cellSize, isMinimap, isMobile, itemScale }: StaticGridProps) => {
  const scale = isMinimap ? 0.5 : (isMobile ? 0.9 : 1);

  return (
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
          const isPower = tile === TileType.POWER_PELLET;
          const isFood = tile === TileType.FOOD;

          let foodSize = 0;
          if (isPower) foodSize = 16 * scale * itemScale;
          if (isFood) foodSize = 8 * scale * itemScale;

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
              {isPower && <Food2D type="power" size={foodSize} />}
              {isFood && <Food2D type="dot" size={foodSize} />}
            </div>
          );
        })
      )}
    </div>
  );
});

/**
 * The dynamic actors (Pac-Man, ghosts, bonus fruit) rendered as a transparent
 * grid overlay sharing the static grid's template, so CSS grid placement keeps
 * them aligned to the same cells. This is the only layer that re-renders on movement.
 */
interface ActorsOverlayProps {
  cols: number;
  cellSize: number;
  isMinimap: boolean;
  isMobile: boolean;
  itemScale: number;
  playerPos: { x: number; z: number };
  ghosts: Ghost[];
  activeBonus: ActiveBonus | null;
  heading?: PlayerHeading;
  flashTick: boolean;
  gameTheme: string;
  ghostVariant: number;
}

const ActorsOverlay = ({
  cols, cellSize, isMinimap, isMobile, itemScale,
  playerPos, ghosts, activeBonus, heading, flashTick, gameTheme, ghostVariant,
}: ActorsOverlayProps) => {
  const scale = isMinimap ? 0.5 : (isMobile ? 0.9 : 1);
  const bonusSize = 24 * scale * itemScale;

  return (
    <div
      className={cn(
        "grid absolute inset-0 pointer-events-none",
        isMinimap ? "border-2 border-transparent gap-[0.5px]" : "border-0 gap-px"
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
      }}
    >
      {/* Bonus fruit (below the characters) */}
      {activeBonus && (
        <div
          className="z-10 flex items-center justify-center"
          style={{ gridColumnStart: activeBonus.x + 1, gridRowStart: activeBonus.z + 1 }}
        >
          {activeBonus.type === 'CHERRY' && <Food2D type="cherry" size={bonusSize} />}
          {activeBonus.type === 'STRAWBERRY' && <Food2D type="strawberry" size={bonusSize} />}
          {activeBonus.type === 'EXTRA_LIFE' && <Food2D type="life" size={bonusSize} />}
        </div>
      )}

      {/* Pac-Man */}
      <div
        className="z-20 flex items-center justify-center"
        style={{ gridColumnStart: playerPos.x + 1, gridRowStart: playerPos.z + 1 }}
      >
        <Pacman2D size={cellSize * 0.9} heading={heading} />
      </div>

      {/* Ghosts */}
      {ghosts.map((ghost, ghostIndex) => {
        const col = Math.round(ghost.x);
        const row = Math.round(ghost.z);

        const isFlashing = ghost.state === GhostState.FLASHING;
        const isScaredState = ghost.state === GhostState.SCARED || isFlashing;

        let currentVariant = 1;
        if (ghost.state === GhostState.EATEN) {
          currentVariant = 3;
        } else if (gameTheme === 'labadze') {
          const labadzeMap = [4, 5, 6, 7];
          currentVariant = labadzeMap[ghostIndex % 4];
        } else {
          currentVariant = (ghostVariant === 1 || ghostVariant === 2) ? ghostVariant : 1;
        }

        const isLabadzeGhost = currentVariant >= 4 && currentVariant <= 7;

        const ghostColor = isFlashing
          ? (flashTick ? '#FFFFFF' : '#0000FF')
          : (isScaredState ? '#0000FF' : GHOST_COLORS[ghostIndex % GHOST_COLORS.length]);

        return (
          <div
            key={ghostIndex}
            className={cn(
              "z-30 flex items-center justify-center pointer-events-none",
              ghost.state !== GhostState.EATEN && "animate-bounce drop-shadow-md",
              isFlashing && isLabadzeGhost && "ghost-css-flash"
            )}
            style={{ gridColumnStart: col + 1, gridRowStart: row + 1 }}
          >
            <Ghost2D
              variant={currentVariant}
              color={ghostColor}
              size={isMinimap ? cellSize : cellSize * 0.9}
              isScared={isScaredState}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Board = ({ isMinimap = false, heading, parentWidth = 0, parentHeight = 0 }: BoardProps) => {
  const { playerPosRef, ghostsPosRef, subscribeToPositions } = useGameRefs();
  const { layout, activeBonus } = useGameLayout();
  const { movePlayer } = useGameActions();
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
  const cols = layout[0]?.length || 19;

  return (
    <div className="relative flex justify-center items-center transition-all duration-300">
      <div className="relative">
        <StaticGrid
          layout={layout}
          cellSize={cellSize}
          isMinimap={isMinimap}
          isMobile={isMobile}
          itemScale={itemScale}
        />
        <ActorsOverlay
          cols={cols}
          cellSize={cellSize}
          isMinimap={isMinimap}
          isMobile={isMobile}
          itemScale={itemScale}
          playerPos={localPlayerPos}
          ghosts={localGhostsPos}
          activeBonus={activeBonus}
          heading={heading}
          flashTick={flashTick}
          gameTheme={settings.gameTheme}
          ghostVariant={settings.ghostVariant}
        />
      </div>
    </div>
  );
};
