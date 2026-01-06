import { useState, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { LEVEL_MAP } from '../utils/constants';
import { TileType } from '../types';

const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 };
  const ghostsStart: Position[] = [];
  const initialLayout = LEVEL_MAP.map(row => [...row]);

  LEVEL_MAP.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile === TileType.PACMAN_START) { 
        pacmanStart = { x: colIndex, z: rowIndex };
      }
      if (tile === TileType.GHOST_START) {
        ghostsStart.push({ x: colIndex, z: rowIndex });
      }
    });
  });

  return { pacmanStart, ghostsStart, initialLayout };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart, initialLayout } = getInitialPositions();

  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos] = useState<Position[]>(ghostsStart);
  
  // დინამიური რუკა და ქულა
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);

  // მოძრაობის და ჭამის ლოგიკა
  const movePlayer = (targetX: number, targetZ: number) => {
    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;

    const targetTile = layout[targetZ][targetX];


    if (targetTile === TileType.WALL) return;

    if (targetTile === TileType.FOOD) {
      setScore((prev) => prev + 10); 
      setLayout((prevLayout) => {
        const newLayout = prevLayout.map((row) => [...row]);
        newLayout[targetZ][targetX] = TileType.EMPTY; 
        return newLayout;
      });
    }
    setPlayerPos({ x: targetX, z: targetZ });
  };

  return (
    <GameContext.Provider value={{ playerPos, setPlayerPos, ghostsPos, score, layout, movePlayer }}>
      {children}
    </GameContext.Provider>
  ); 
};