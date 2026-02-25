import { createContext, useContext, type RefObject } from 'react';
import type { GameStatus, Ghost, Coordinate, ActiveBonus } from '../types'; 

export type Position = Coordinate;

export interface GameContextType {

  playerPosRef: RefObject<Position>;
  ghostsPosRef: RefObject<Ghost[]>; 
  
  score: number;
  layout: number[][];
  gameStatus: GameStatus; 
  remainingFood: number; 
  lives: number; 
  level: number;
  activeBonus: ActiveBonus | null;
  elapsedTime: number;

  subscribeToPositions: (callback: () => void) => () => void;

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