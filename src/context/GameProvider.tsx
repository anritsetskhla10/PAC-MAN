import { useState, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { LEVEL_MAP } from '../utils/constants'; 
import { TileType } from '../types'; 


const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 }; // Default 
  const ghostsStart: Position[] = [];

  LEVEL_MAP.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      // 3 = PACMAN_START
      if (tile === TileType.PACMAN_START) { 
        pacmanStart = { x: colIndex, z: rowIndex };
      }
      // 4 = GHOST_START
      if (tile === TileType.GHOST_START) {
        ghostsStart.push({ x: colIndex, z: rowIndex });
      }
    });
  });

  return { pacmanStart, ghostsStart };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart } = getInitialPositions();
  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos] = useState<Position[]>(ghostsStart);

  return (
    <GameContext.Provider value={{ playerPos, setPlayerPos, ghostsPos }}>
      {children}
    </GameContext.Provider>
  ); 
};