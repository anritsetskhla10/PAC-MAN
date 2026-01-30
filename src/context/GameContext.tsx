import { createContext, useContext } from 'react';
import type { GameStatus, Ghost, Coordinate } from '../types'; 

export type Position = Coordinate;

export interface GameContextType {
  playerPos: Position;
  ghostsPos: Ghost[]; 
  score: number;
  layout: number[][];
  gameStatus: GameStatus; 
  remainingFood: number; 
  lives: number; 
  level: number;

  movePlayer: (x: number, z: number) => void;
  startGame: () => void; 
  startRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void; 
  nextLevel: () => void; 
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};