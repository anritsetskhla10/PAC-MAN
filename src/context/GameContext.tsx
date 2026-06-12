import { createContext, useContext, type RefObject } from 'react';
import type { GameStatus, Ghost, Coordinate, ActiveBonus } from '../types';

export type Position = Coordinate;

/**
 * The game state is split across several contexts grouped by how often each
 * piece of data changes. This keeps high-frequency updates (score, timer, the
 * maze layout) from re-rendering consumers that don't read them.
 *
 *  - Metrics: HUD scalars that change many times per second (score, timer...).
 *  - Layout:  the maze grid + active bonus — changes once per dot eaten.
 *  - Session: low-frequency structural state (gameStatus, level).
 *  - Refs:    mutable refs + the position subscription — stable for the whole
 *             session, so consumers reading only these never re-render.
 *  - Actions: imperative callbacks (movePlayer, startGame...).
 */

// 1. Metrics — high-frequency scalars, consumed by the HUD only.
export interface GameMetricsContextType {
  score: number;
  lives: number;
  remainingFood: number;
  elapsedTime: number;
}
export const GameMetricsContext = createContext<GameMetricsContextType | undefined>(undefined);

// 2. Layout — changes once per dot eaten.
export interface GameLayoutContextType {
  layout: number[][];
  activeBonus: ActiveBonus | null;
}
export const GameLayoutContext = createContext<GameLayoutContextType | undefined>(undefined);

// 3. Session — low-frequency structural state.
export interface GameSessionContextType {
  gameStatus: GameStatus;
  level: number;
}
export const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

// 4. Refs — stable for the whole session.
export interface GameRefsContextType {
  playerPosRef: RefObject<Position>;
  ghostsPosRef: RefObject<Ghost[]>;
  layoutRef: RefObject<number[][]>;
  subscribeToPositions: (callback: () => void) => () => void;
}
export const GameRefsContext = createContext<GameRefsContextType | undefined>(undefined);

// 5. Actions — imperative callbacks.
export interface GameActionsContextType {
  movePlayer: (x: number, z: number) => void;
  startGame: () => void;
  startRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  nextLevel: () => void;
}
export const GameActionsContext = createContext<GameActionsContextType | undefined>(undefined);

function useGameContext<T>(context: React.Context<T | undefined>, hookName: string): T {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(`${hookName} must be used within a GameProvider`);
  }
  return value;
}

export const useGameMetrics = () => useGameContext(GameMetricsContext, 'useGameMetrics');
export const useGameLayout = () => useGameContext(GameLayoutContext, 'useGameLayout');
export const useGameSession = () => useGameContext(GameSessionContext, 'useGameSession');
export const useGameRefs = () => useGameContext(GameRefsContext, 'useGameRefs');
export const useGameActions = () => useGameContext(GameActionsContext, 'useGameActions');
