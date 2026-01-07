import { createContext, useContext } from 'react';
import type { GameStatus } from '../types';

export interface Position {
  x: number;
  z: number;
}

export interface GameContextType {
  // მონაცემები
  playerPos: Position;
  ghostsPos: Position[];
  score: number;
  layout: number[][];
  gameStatus: GameStatus; 

  // ფუნქციები
  movePlayer: (x: number, z: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};