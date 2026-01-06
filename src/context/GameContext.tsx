import { createContext, useContext } from 'react';

export interface Position {
  x: number;
  z: number;
}

export interface GameContextType {
  playerPos: Position;
  setPlayerPos: (pos: Position) => void;
  ghostsPos: Position[];
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};