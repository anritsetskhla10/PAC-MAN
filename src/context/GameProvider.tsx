import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost, type GlobalMode } from '../types';
import { LEVEL_MAP, SCORES, GHOST_CONFIG, GHOST_SPEEDS, WAVE_TIMINGS, TUNNEL_ROW } from '../utils/constants'; 
import { calculateGhostNextMove } from '../utils/ghostLogic'; 
import { useTheme } from './ThemeContext';

const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 };
  const ghostsStart: Ghost[] = [];
  const initialLayout = LEVEL_MAP.map(row => [...row]); 
  let foodCount = 0; 

  LEVEL_MAP.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile === TileType.PACMAN_START) pacmanStart = { x: colIndex, z: rowIndex };
      if (tile === TileType.GHOST_START) {
        const ghostTypes = Object.values(GHOST_CONFIG);
        const type = ghostTypes[ghostsStart.length % ghostTypes.length];
        ghostsStart.push({ 
            x: colIndex, z: rowIndex, startX: colIndex, startZ: rowIndex,
            color: type.color, 
            state: GhostState.NORMAL,
            currentDir: { x: 0, z: 0 },
            movementProgress: 0 
        });
      }
      if (([TileType.FOOD, TileType.POWER_PELLET, TileType.CHERRY, TileType.STRAWBERRY] as number[]).includes(tile)) {
        foodCount++;
      }
    });
  });
  return { pacmanStart, ghostsStart, initialLayout, foodCount };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart, initialLayout, foodCount } = getInitialPositions();
  const { settings } = useTheme();

  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Ghost[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing'); 
  const [remainingFood, setRemainingFood] = useState<number>(foodCount); 
  const [dotsEaten, setDotsEaten] = useState<number>(0); 

  const [globalMode, setGlobalMode] = useState<GlobalMode>('SCATTER');
  const [waveIndex, setWaveIndex] = useState(0);
  const waveTimerRef = useRef<number>(0);

  const playerDirRef = useRef<Position>({ x: 1, z: 0 }); 
  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);

  const startGame = () => setGameStatus('playing');
  const pauseGame = () => { if (gameStatus === 'playing') setGameStatus('paused'); };
  const resumeGame = () => { if (gameStatus === 'paused') setGameStatus('playing'); };
  
  const restartGame = () => {
    const freshData = getInitialPositions();
    setPlayerPos(freshData.pacmanStart);
    setGhostsPos(freshData.ghostsStart);
    setLayout(freshData.initialLayout);
    setRemainingFood(freshData.foodCount); 
    setDotsEaten(0); 
    setScore(0);
    setGameStatus('playing'); 
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    waveTimerRef.current = 0;
    playerDirRef.current = { x: 1, z: 0 };
  };

  const getGhostSpeed = (ghost: Ghost, remainingFood: number) => {
      if (ghost.state === GhostState.EATEN) return GHOST_SPEEDS.EATEN;
      if (ghost.state === GhostState.SCARED) return GHOST_SPEEDS.SCARED;
      if (Math.round(ghost.z) === TUNNEL_ROW && (ghost.x < 2 || ghost.x > 16)) return GHOST_SPEEDS.TUNNEL;
      if (ghost.color === GHOST_CONFIG.BLINKY.color) {
          if (remainingFood <= 10) return GHOST_SPEEDS.ELROY_2; 
          if (remainingFood <= 20) return GHOST_SPEEDS.ELROY_1; 
      }
      return GHOST_SPEEDS.NORMAL;
  };

  const activatePowerMode = () => {
    setGhostsPos(prev => prev.map(g => {
        if (g.state !== GhostState.EATEN) {
            return { 
                ...g, 
                state: GhostState.SCARED,
                currentDir: { x: -g.currentDir.x, z: -g.currentDir.z }, 
                movementProgress: 0 
            };
        }
        return g;
    }));
    setTimeout(() => {
        setGhostsPos(prev => prev.map(g => {
            if (g.state === GhostState.SCARED) return { ...g, state: GhostState.NORMAL };
            return g;
        }));
    }, 10000);
  };

  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (gameStatus !== 'playing') return;
    
    // Tunnel
    if (targetZ === TUNNEL_ROW) {
        if (targetX < 0) targetX = 18;
        else if (targetX > 18) targetX = 0;
    }

    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    if (layout[targetZ][targetX] === TileType.WALL) return;

    const dx = targetX - playerPos.x;
    const dz = targetZ - playerPos.z;
    if (dx !== 0 || dz !== 0) playerDirRef.current = { x: dx, z: dz };

    const tile = layout[targetZ][targetX];
    const isFood = ([TileType.FOOD, TileType.POWER_PELLET, TileType.CHERRY, TileType.STRAWBERRY] as number[]).includes(tile);

    if (isFood) {
      let pts = 0;
      if (tile === TileType.FOOD) { pts = SCORES.DOT; setDotsEaten(prev => prev + 1); } 
      if (tile === TileType.POWER_PELLET) { pts = SCORES.POWER_PELLET; setDotsEaten(prev => prev + 1); activatePowerMode(); }
      if (tile === TileType.CHERRY) pts = SCORES.CHERRY;
      if (tile === TileType.STRAWBERRY) pts = SCORES.STRAWBERRY;
      
      setScore(s => s + pts);
      setLayout(l => {
        const nl = l.map(r => [...r]);
        nl[targetZ][targetX] = TileType.EMPTY;
        return nl;
      });
      setRemainingFood(prev => {
          const newState = prev - 1;
          if (newState <= 0) setGameStatus('won'); 
          return newState;
      });
    }
    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, gameStatus, playerPos]);

  // --- RELEASE LOGIC ---
  const checkCanLeave = (ghost: Ghost, eatenCount: number) => {
      if (ghost.color === GHOST_CONFIG.BLINKY.color) return true;
      if (ghost.color === GHOST_CONFIG.PINKY.color && eatenCount >= 5) return true;
      if (ghost.color === GHOST_CONFIG.INKY.color && eatenCount >= 30) return true;
      if (ghost.color === GHOST_CONFIG.CLYDE.color && eatenCount >= 60) return true;
      return false;
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      if (waveIndex < WAVE_TIMINGS.length) {
          const currentWave = WAVE_TIMINGS[waveIndex];
          if (currentWave.duration !== -1) {
              waveTimerRef.current += 0.05; 
              if (waveTimerRef.current >= currentWave.duration) {
                  const nextIndex = waveIndex + 1;
                  if (nextIndex < WAVE_TIMINGS.length) {
                      setWaveIndex(nextIndex);
                      setGlobalMode(WAVE_TIMINGS[nextIndex].mode as GlobalMode);
                      waveTimerRef.current = 0;
                      setGhostsPos(gs => gs.map(g => {
                          if (g.state === GhostState.NORMAL) return { ...g, currentDir: { x: -g.currentDir.x, z: -g.currentDir.z } };
                          return g;
                      }));
                  }
              }
          }
      }

      setGhostsPos(prev => {
        return prev.map((g) => {
          const speed = getGhostSpeed(g, remainingFood);
          let newProgress = g.movementProgress + speed;

          if (newProgress >= 1) {
             newProgress -= 1; 

             if (g.state === GhostState.EATEN) {
                 const dist = Math.abs(g.x - g.startX) + Math.abs(g.z - g.startZ);
                 if (dist < 0.5) return { ...g, state: GhostState.NORMAL, movementProgress: 0 };
             }

             const isElroy = g.color === GHOST_CONFIG.BLINKY.color && remainingFood <= 20;
             const canLeave = checkCanLeave(g, dotsEaten);

             const moveResult = calculateGhostNextMove(
               g, 
               prev, 
               playerPosRef.current, 
               playerDirRef.current, 
               layoutRef.current,
               settings.difficulty,
               globalMode,
               isElroy,
               canLeave
             );

             let nextX = moveResult.nextPos.x;
             const nextZ = moveResult.nextPos.z;
             if (nextZ === TUNNEL_ROW) {
                if (nextX < 0) nextX = 18;
                else if (nextX > 18) nextX = 0;
             }

             return { 
                 ...g, 
                 x: nextX, 
                 z: nextZ,
                 currentDir: moveResult.nextDir,
                 movementProgress: newProgress
             };
          }
          return { ...g, movementProgress: newProgress };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStatus, settings.difficulty, remainingFood, globalMode, waveIndex, dotsEaten]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const hitIndex = ghostsPos.findIndex(g => Math.round(g.x) === playerPos.x && Math.round(g.z) === playerPos.z);
    if (hitIndex !== -1) {
        const ghost = ghostsPos[hitIndex];
        setTimeout(() => {
            if (ghost.state === GhostState.NORMAL) {
                setGameStatus('gameover'); 
            } else if (ghost.state === GhostState.SCARED) {
                setScore(s => s + 200);
                setGhostsPos(prev => {
                    const ng = [...prev];
                    ng[hitIndex] = { ...ghost, state: GhostState.EATEN, movementProgress: 0 };
                    return ng;
                });
            }
        }, 0);
    }
  }, [playerPos, ghostsPos, gameStatus]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
         if (gameStatus === 'playing') setGameStatus('paused');
         else if (gameStatus === 'paused') setGameStatus('playing');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameStatus]);

  return (
    <GameContext.Provider value={{ 
      playerPos, ghostsPos, score, layout, gameStatus, remainingFood, 
      movePlayer, startGame, pauseGame, resumeGame, restartGame 
    }}>
      {children}
    </GameContext.Provider>
  );
};