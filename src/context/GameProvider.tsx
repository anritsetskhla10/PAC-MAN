import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost, type GlobalMode } from '../types';
import { LEVEL_MAP, SCORES, GHOST_CONFIG, GHOST_SPEEDS, WAVE_TIMINGS, TUNNEL_ROW } from '../utils/constants'; 
import { calculateGhostNextMove } from '../utils/ghostLogic'; 
import { useTheme } from './ThemeContext';

const MAX_LIVES = 3;

// Helper to get starting coordinates without resetting the map layout
const getStartingCoordinates = () => {
    let pacmanStart: Position = { x: 1, z: 1 };
    const ghostsStart: Ghost[] = [];
    
    LEVEL_MAP.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === TileType.PACMAN_START) pacmanStart = { x: colIndex, z: rowIndex };
            if (tile === TileType.GHOST_START) {
                const ghostTypes = Object.values(GHOST_CONFIG);
                const type = ghostTypes[ghostsStart.length % ghostTypes.length];
                ghostsStart.push({ 
                    x: colIndex, z: rowIndex, startX: colIndex, startZ: rowIndex,
                    color: type.color, state: GhostState.NORMAL, currentDir: { x: 0, z: 0 }, movementProgress: 0 
                });
            }
        });
    });
    return { pacmanStart, ghostsStart };
};

// Full initialization helper
const getInitialPositions = () => {
  const { pacmanStart, ghostsStart } = getStartingCoordinates();
  const initialLayout = LEVEL_MAP.map(row => [...row]); 
  let foodCount = 0; 

  LEVEL_MAP.forEach((row) => {
    row.forEach((tile) => {
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

  // State
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [level, setLevel] = useState<number>(1);
  
  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Ghost[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle'); 
  const [remainingFood, setRemainingFood] = useState<number>(foodCount); 
  const [dotsEaten, setDotsEaten] = useState<number>(0); 
  const [ghostsEatenBatch, setGhostsEatenBatch] = useState<number>(0); 
  const [globalMode, setGlobalMode] = useState<GlobalMode>('SCATTER');
  const [waveIndex, setWaveIndex] = useState(0);

  const waveTimerRef = useRef<number>(0);
  const powerModeTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const playerDirRef = useRef<Position>({ x: 1, z: 0 }); 
  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);

  //  ACTIONS 

  //  Soft Reset (Respawn): Returns entities to start, keeps score/dots
  const softReset = useCallback(() => {
     const { pacmanStart, ghostsStart } = getStartingCoordinates();
     setPlayerPos(pacmanStart);
     setGhostsPos(ghostsStart);
     playerDirRef.current = { x: 1, z: 0 };
     setGlobalMode('SCATTER');
     setWaveIndex(0);
     waveTimerRef.current = 0;
  }, []);

  // Start Game: Go to "Ready" screen
  const startGame = () => {
    if (gameStatus === 'idle' || gameStatus === 'gameover' || gameStatus === 'won') {
        restartGame();
    } else {
        setGameStatus('ready');
    }
  };

  // Start Round: Manual Trigger from "Ready" screen
  const startRound = () => {
    setGameStatus('playing');
  };

  const pauseGame = () => { if (gameStatus === 'playing') setGameStatus('paused'); };
  const resumeGame = () => { if (gameStatus === 'paused') setGameStatus('playing'); };
  
  //  Hard Reset: Full Restart
  const restartGame = () => {
    if (powerModeTimerRef.current) clearTimeout(powerModeTimerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    const freshData = getInitialPositions();
    setPlayerPos(freshData.pacmanStart);
    setGhostsPos(freshData.ghostsStart);
    setLayout(freshData.initialLayout);
    setRemainingFood(freshData.foodCount); 
    setDotsEaten(0); 
    setScore(0);
    setLives(MAX_LIVES); 
    setLevel(1);         
    setGhostsEatenBatch(0);
    
    setGameStatus('ready'); 
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    waveTimerRef.current = 0;
    playerDirRef.current = { x: 1, z: 0 };
  };

  // Next Level Logic: Spawns extra life if needed
  const nextLevel = () => {
      const freshData = getInitialPositions();
      const newLayout = freshData.initialLayout.map(row => [...row]);
      let newFoodCount = freshData.foodCount;

      // Logic: Spawn extra life if lives < MAX_LIVES
      if (lives < MAX_LIVES) {
          // Attempt to spawn at coordinates [15, 9] (Adjust based on your map)
          // Ensure it's not a wall or ghost house
          const spawnZ = 15;
          const spawnX = 9;

          if (newLayout[spawnZ] && newLayout[spawnZ][spawnX] !== TileType.WALL && newLayout[spawnZ][spawnX] !== TileType.GHOST_HOUSE) {
             // If replacing food, decrease count
             if (newLayout[spawnZ][spawnX] === TileType.FOOD) newFoodCount--;
             
             newLayout[spawnZ][spawnX] = TileType.EXTRA_LIFE;
          }
      }

      setPlayerPos(freshData.pacmanStart);
      setGhostsPos(freshData.ghostsStart);
      setLayout(newLayout);
      setRemainingFood(newFoodCount);
      setDotsEaten(0);
      setLevel(prev => prev + 1);
      
      setGameStatus('ready'); 
      setGlobalMode('SCATTER');
      setWaveIndex(0);
      waveTimerRef.current = 0;
      playerDirRef.current = { x: 1, z: 0 };
  };

  const getGhostSpeed = (ghost: Ghost, remainingFood: number) => {
      if (ghost.state === GhostState.EATEN || ghost.state === GhostState.EYES) return GHOST_SPEEDS.EATEN;
      if (ghost.state === GhostState.SCARED || ghost.state === GhostState.FLASHING) return GHOST_SPEEDS.SCARED;
      if (Math.round(ghost.z) === TUNNEL_ROW && (ghost.x < 2 || ghost.x > 16)) return GHOST_SPEEDS.TUNNEL;
      if (ghost.color === GHOST_CONFIG.BLINKY.color) {
          if (remainingFood <= 10) return GHOST_SPEEDS.ELROY_2; 
          if (remainingFood <= 20) return GHOST_SPEEDS.ELROY_1; 
      }
      return GHOST_SPEEDS.NORMAL;
  };

  //  POWER MODE 
  const activatePowerMode = () => {
    if (powerModeTimerRef.current) clearTimeout(powerModeTimerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    setGhostsEatenBatch(0);

    setGhostsPos(prev => prev.map(g => {
        if (g.state === GhostState.EATEN || g.state === GhostState.EYES) return g;
        return { 
            ...g, 
            state: GhostState.SCARED,
            currentDir: { x: -g.currentDir.x, z: -g.currentDir.z }, 
            movementProgress: 1 - g.movementProgress 
        };
    }));

    const DURATION = 7000;
    const FLASH_START = DURATION - 2000; 

    flashTimerRef.current = setTimeout(() => {
        setGhostsPos(prev => prev.map(g => {
            if (g.state === GhostState.SCARED) return { ...g, state: GhostState.FLASHING };
            return g;
        }));
    }, FLASH_START);

    powerModeTimerRef.current = setTimeout(() => {
        setGhostsPos(prev => prev.map(g => {
            if (g.state === GhostState.SCARED || g.state === GhostState.FLASHING) {
                return { ...g, state: GhostState.NORMAL };
            }
            return g;
        }));
        setGhostsEatenBatch(0);
    }, DURATION);
  };

  //  MOVE PLAYER 
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
    const isInteractable = ([TileType.FOOD, TileType.POWER_PELLET, TileType.CHERRY, TileType.STRAWBERRY, TileType.EXTRA_LIFE] as number[]).includes(tile);

    if (isInteractable) {
      let pts = 0;
      if (tile === TileType.FOOD) { pts = SCORES.DOT; setDotsEaten(prev => prev + 1); } 
      if (tile === TileType.POWER_PELLET) { 
          pts = SCORES.POWER_PELLET; 
          setDotsEaten(prev => prev + 1); 
          activatePowerMode(); 
      }
      
      // Extra Life Logic
      if (tile === TileType.EXTRA_LIFE) {
          pts = SCORES.EXTRA_LIFE;
          setLives(prev => Math.min(prev + 1, MAX_LIVES));
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }

      if (tile === TileType.CHERRY) pts = SCORES.CHERRY;
      if (tile === TileType.STRAWBERRY) pts = SCORES.STRAWBERRY;
      
      setScore(s => s + pts);
      
      setLayout(l => {
        const nl = l.map(r => [...r]);
        nl[targetZ][targetX] = TileType.EMPTY;
        return nl;
      });

      // Only decrease food count for actual food items, not Extra Life
      if (tile !== TileType.EXTRA_LIFE) {
          setRemainingFood(prev => {
              const newState = prev - 1;
              if (newState <= 0) {
                   setGameStatus('won'); 
              }
              return newState;
          });
      }
    }
    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, gameStatus, playerPos]);

  //  GAME LOOP 
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      // Wave Logic
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

      // Move Ghosts
      setGhostsPos(prev => {
        return prev.map((g) => {
          const speed = getGhostSpeed(g, remainingFood);
          let newProgress = g.movementProgress + speed;

          if (newProgress >= 1) {
             newProgress -= 1; 

             if (g.state === GhostState.EATEN || g.state === GhostState.EYES) {
                 const dist = Math.abs(g.x - g.startX) + Math.abs(g.z - g.startZ);
                 if (dist < 0.5) return { ...g, state: GhostState.NORMAL, movementProgress: 0 };
             }

             const isElroy = g.color === GHOST_CONFIG.BLINKY.color && remainingFood <= 20;
             // Using dotsEaten for consistency
             const checkCanLeave = (ghost: Ghost, eatenCount: number) => {
                if (ghost.color === GHOST_CONFIG.BLINKY.color) return true;
                if (ghost.color === GHOST_CONFIG.PINKY.color && eatenCount >= 5) return true;
                if (ghost.color === GHOST_CONFIG.INKY.color && eatenCount >= 30) return true;
                if (ghost.color === GHOST_CONFIG.CLYDE.color && eatenCount >= 60) return true;
                return false;
             };
             const canLeave = checkCanLeave(g, dotsEaten);

             const moveResult = calculateGhostNextMove(
               g, prev, playerPosRef.current, playerDirRef.current, layoutRef.current,
               settings.difficulty, globalMode, isElroy, canLeave
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
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameStatus, settings.difficulty, remainingFood, globalMode, waveIndex, dotsEaten]);

  //  COLLISION LOGIC 
 useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const hitIndex = ghostsPos.findIndex(g => 
       Math.abs(g.x - playerPos.x) < 0.6 && Math.abs(g.z - playerPos.z) < 0.6
    );

    if (hitIndex !== -1) {
        const ghost = ghostsPos[hitIndex];
        
        const timerId = setTimeout(() => {
            
            if (ghost.state === GhostState.NORMAL) {
                if (lives > 1) {
                    setLives(prev => prev - 1);
                    setGameStatus('ready'); 
                    softReset(); 
                    if (navigator.vibrate) navigator.vibrate(500); 
                } else {
                    setLives(0);
                    setGameStatus('gameover');
                    if (navigator.vibrate) navigator.vibrate(1000);
                }
            } 
            else if (ghost.state === GhostState.SCARED || ghost.state === GhostState.FLASHING) {
                 const comboMultiplier = Math.pow(2, ghostsEatenBatch);
                 const points = 200 * comboMultiplier;
                 
                 setScore(s => s + points);
                 setGhostsEatenBatch(prev => prev + 1);
                 
                 setGhostsPos(prev => {
                    const ng = [...prev];
                    if (ng[hitIndex]) {
                        ng[hitIndex] = { ...ghost, state: GhostState.EATEN, movementProgress: 0 };
                    }
                    return ng;
                });
            }
        }, 0);

        return () => clearTimeout(timerId);
    }
  }, [playerPos, ghostsPos, gameStatus, ghostsEatenBatch, lives, softReset]);

  // Escape key handler
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
      playerPos, ghostsPos, score, layout, gameStatus, remainingFood, lives, level,
      movePlayer, startGame, startRound, pauseGame, resumeGame, restartGame, nextLevel 
    }}>
      {children}
    </GameContext.Provider>
  );
};