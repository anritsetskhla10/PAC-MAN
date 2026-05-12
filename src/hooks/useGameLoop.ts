import { useEffect } from 'react';
import { type GameStatus, type GlobalMode, GhostState, type Ghost, type Difficulty } from '../types';
import { type Position } from '../context/GameContext';
import { WAVE_TIMINGS, GHOST_CONFIG, GHOST_SPEEDS, TUNNEL_ROW } from '../utils/constants';
import { calculateGhostNextMove } from '../utils/ghostLogic';
import { checkCollision } from '../utils/physics';

interface GameStateRef {
    remainingFood: number;
    dotsEaten: number;
    globalMode: GlobalMode;
    waveIndex: number;
    difficulty: Difficulty;
}

interface UseGameLoopProps {
  gameStatus: GameStatus;
  gameStateRef: React.MutableRefObject<GameStateRef>;
  setGlobalMode: React.Dispatch<React.SetStateAction<GlobalMode>>;
  setWaveIndex: React.Dispatch<React.SetStateAction<number>>;
  playerPosRef: React.MutableRefObject<Position>;
  playerDirRef: React.MutableRefObject<Position>;
  ghostsPosRef: React.MutableRefObject<Ghost[]>;
  layoutRef: React.MutableRefObject<number[][]>;
  waveTimerRef: React.MutableRefObject<number>;
  notifyListeners: () => void;
  handleCollisionHit: (hitGhost: Ghost, hitGhostIndex: number) => void;
}

export const useGameLoop = ({
  gameStatus,
  gameStateRef,
  setGlobalMode,
  setWaveIndex,
  playerPosRef,
  playerDirRef,
  ghostsPosRef,
  layoutRef,
  waveTimerRef,
  notifyListeners,
  handleCollisionHit,
}: UseGameLoopProps) => {

  const getGhostSpeed = (ghost: Ghost, remainingFoodCount: number) => {
      if (ghost.state === GhostState.EATEN || ghost.state === GhostState.EYES) return GHOST_SPEEDS.EATEN;
      if (ghost.state === GhostState.SCARED || ghost.state === GhostState.FLASHING) return GHOST_SPEEDS.SCARED;
      if (Math.round(ghost.z) === TUNNEL_ROW && (ghost.x < 2 || ghost.x > 16)) return GHOST_SPEEDS.TUNNEL;
      if (ghost.color === GHOST_CONFIG.BLINKY.color) {
          if (remainingFoodCount <= 10) return GHOST_SPEEDS.ELROY_2; 
          if (remainingFoodCount <= 20) return GHOST_SPEEDS.ELROY_1; 
      }
      return GHOST_SPEEDS.NORMAL;
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulator = 0;
    const TICK_RATE = 50; 

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      accumulator += deltaTime;

      let hasPositionChanged = false;
      
      const { remainingFood: currFood, dotsEaten: currDots, globalMode: currMode, waveIndex: currWave, difficulty: currDifficulty } = gameStateRef.current;

      while (accumulator >= TICK_RATE) {
        accumulator -= TICK_RATE;

        if (currWave < WAVE_TIMINGS.length) {
          const currentWaveObj = WAVE_TIMINGS[currWave];
          if (currentWaveObj.duration !== -1) {
              waveTimerRef.current += 0.05; 
              if (waveTimerRef.current >= currentWaveObj.duration) {
                  const nextIndex = currWave + 1;
                  if (nextIndex < WAVE_TIMINGS.length) {
                      setWaveIndex(nextIndex);
                      setGlobalMode(WAVE_TIMINGS[nextIndex].mode as GlobalMode);
                      waveTimerRef.current = 0;
                      
                      ghostsPosRef.current = ghostsPosRef.current.map(g => {
                          if (g.state === GhostState.NORMAL) {
                              const inHouse = (g.x >= 8 && g.x <= 10) && (g.z > 8.5 && g.z < 9.5);
                              
                              if (inHouse) {
                                  return { 
                                      ...g, 
                                      currentDir: { x: -g.currentDir.x, z: -g.currentDir.z }
                                  };
                              }
                              return { 
                                  ...g, 
                                  x: g.x - g.currentDir.x,
                                  z: g.z - g.currentDir.z,
                                  currentDir: { x: -g.currentDir.x, z: -g.currentDir.z },
                                  movementProgress: 1 - g.movementProgress
                              };
                          }
                          return g;
                      });
                      hasPositionChanged = true;
                  }
              }
          }
        }

        const prevGhosts = ghostsPosRef.current;
        const updatedGhosts = prevGhosts.map((g) => {
          const speed = getGhostSpeed(g, currFood);
          let newProgress = g.movementProgress + speed;

          if (newProgress >= 1) {
             newProgress -= 1; 
             if (g.state === GhostState.EATEN || g.state === GhostState.EYES) {
                 const dist = Math.abs(g.x - g.startX) + Math.abs(g.z - g.startZ);
                 if (dist < 0.5) return { ...g, state: GhostState.NORMAL, movementProgress: 0 };
             }
             const isElroy = g.color === GHOST_CONFIG.BLINKY.color && currFood <= 20;
             const checkCanLeave = (ghost: Ghost, eatenCount: number) => {
                if (ghost.color === GHOST_CONFIG.BLINKY.color) return true;
                if (ghost.color === GHOST_CONFIG.PINKY.color) return true;
                if (ghost.color === GHOST_CONFIG.INKY.color && eatenCount >= 30) return true;
                if (ghost.color === GHOST_CONFIG.CLYDE.color && eatenCount >= 60) return true;
                return false;
             };
             const canLeave = checkCanLeave(g, currDots);

             const moveResult = calculateGhostNextMove(
               g, prevGhosts, playerPosRef.current, playerDirRef.current, layoutRef.current,
               currDifficulty, currMode, isElroy, canLeave
             );

             let nextX = moveResult.nextPos.x;
             const nextZ = moveResult.nextPos.z;
             if (nextZ === TUNNEL_ROW) {
                if (nextX < 0) nextX = 18;
                else if (nextX > 18) nextX = 0;
             }

             return { 
                 ...g, x: nextX, z: nextZ,
                 currentDir: moveResult.nextDir, movementProgress: newProgress
             };
          }
          return { ...g, movementProgress: newProgress };
        });

        ghostsPosRef.current = updatedGhosts;
        hasPositionChanged = true;

        const { hit, hitGhostIndex, hitGhost } = checkCollision(playerPosRef.current, ghostsPosRef.current);
        if (hit && hitGhost) {
            handleCollisionHit(hitGhost, hitGhostIndex);
            hasPositionChanged = true;
        }
      }

      if (hasPositionChanged) {
          notifyListeners();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStatus, gameStateRef, ghostsPosRef, layoutRef, playerDirRef, playerPosRef, waveTimerRef, notifyListeners, handleCollisionHit, setGlobalMode, setWaveIndex]);
};