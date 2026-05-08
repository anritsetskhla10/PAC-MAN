import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost, type GlobalMode, type ActiveBonus, type BonusType } from '../types';
import { LEVEL_MAPS, GHOST_CONFIG, GHOST_SPEEDS, WAVE_TIMINGS, TUNNEL_ROW, SPAWN_POINTS } from '../utils/constants';
import { calculateGhostNextMove } from '../utils/ghostLogic'; 
import { useTheme } from './ThemeContext';
import { useGameAudio } from '../hooks/useGameAudio'; 
import { checkCollision, checkFoodEaten, checkBonusEaten } from '../utils/physics';
import { Howler } from 'howler';

const MAX_LIVES = 3;

const getStartingCoordinates = (currentMap: number[][]) => {
    let pacmanStart: Position = { x: 1, z: 1 };
    const ghostsStart: Ghost[] = [];
    currentMap.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === TileType.PACMAN_START) pacmanStart = { x: colIndex, z: rowIndex };
            if (tile === TileType.GHOST_START) {
                const ghostTypes = Object.values(GHOST_CONFIG);
                const type = ghostTypes[ghostsStart.length % ghostTypes.length];
                
                let initialX = colIndex;
                let initialZ = rowIndex;
                let currentDir = { x: 0, z: 0 };

                if (type.color === GHOST_CONFIG.BLINKY.color) {
                    initialX = 9;
                    initialZ = 7;
                    currentDir = { x: -1, z: 0 }; 
                } else if (type.color === GHOST_CONFIG.PINKY.color) {
                    currentDir = { x: 0, z: -1 }; 
                }

                ghostsStart.push({ 
                    x: initialX, z: initialZ, startX: colIndex, startZ: rowIndex,
                    color: type.color, state: GhostState.NORMAL, currentDir, movementProgress: 0 
                });
            }
        });
    });
    return { pacmanStart, ghostsStart };
};

const getInitialPositions = (levelIndex: number = 1) => {
  const mapIndex = (levelIndex - 1) % LEVEL_MAPS.length;
  const selectedMap = LEVEL_MAPS[mapIndex];
  const { pacmanStart, ghostsStart } = getStartingCoordinates(selectedMap);
  const initialLayout = selectedMap.map(row => [...row]); 
  let foodCount = 0; 
  selectedMap.forEach((row) => {
    row.forEach((tile) => {
      if (([TileType.FOOD, TileType.POWER_PELLET] as number[]).includes(tile)) {
        foodCount++;
      }
    });
  });
  return { pacmanStart, ghostsStart, initialLayout, foodCount };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart, initialLayout, foodCount } = getInitialPositions(1);
  const { settings } = useTheme();
  const { playChomp, playDeath, playIntro, playEatGhost, playExtraLife, playFruit, playLevelUp, playPowerPellet } = useGameAudio();

  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [level, setLevel] = useState<number>(1);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle'); 
  const [remainingFood, setRemainingFood] = useState<number>(foodCount); 
  const [dotsEaten, setDotsEaten] = useState<number>(0); 
  const [ghostsEatenBatch, setGhostsEatenBatch] = useState<number>(0); 
  const [globalMode, setGlobalMode] = useState<GlobalMode>('SCATTER');
  const [waveIndex, setWaveIndex] = useState(0);

  const [activeBonus, setActiveBonus] = useState<ActiveBonus | null>(null);
  const [extraLifeSpawned, setExtraLifeSpawned] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const playerPosRef = useRef<Position>(pacmanStart);
  const ghostsPosRef = useRef<Ghost[]>(ghostsStart);

  const listenersRef = useRef<Set<() => void>>(new Set());
  const notifyListeners = useCallback(() => {
      listenersRef.current.forEach(listener => listener());
  }, []);
  const subscribeToPositions = useCallback((callback: () => void) => {
      listenersRef.current.add(callback);
      return () => listenersRef.current.delete(callback);
  }, []);

  const waveTimerRef = useRef<number>(0);
  const powerModeTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const bonusTimerRef = useRef<number | null>(null);
  const collisionProcessedRef = useRef(false);

  
  const playerDirRef = useRef<Position>({ x: 1, z: 0 }); 
  const layoutRef = useRef(layout);

  const resumeAudioContext = () => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  };

  useEffect(() => { layoutRef.current = layout; }, [layout]);

  useEffect(() => {
    let intervalId: number;
    if (gameStatus === 'playing') {
      intervalId = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameStatus]);

  const spawnBonus = useCallback((type: BonusType) => {
    if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
    
    const randomIndex = Math.floor(Math.random() * SPAWN_POINTS.length);
    const spawnPos = SPAWN_POINTS[randomIndex];

    let points = 0;
    if (type === 'CHERRY') points = 100;
    if (type === 'STRAWBERRY') points = 300;
    if (type === 'EXTRA_LIFE') points = 200;

    setActiveBonus({
        type,
        x: spawnPos.x,
        z: spawnPos.z,
        points,
        expiresAt: Date.now() + 15000 
    });

    bonusTimerRef.current = setTimeout(() => {
        setActiveBonus(null);
    }, 15000);
  }, []);

  const softReset = useCallback(() => {
    collisionProcessedRef.current = false;
    const mapIndex = (level - 1) % LEVEL_MAPS.length;
    const currentMap = LEVEL_MAPS[mapIndex];
    const { pacmanStart, ghostsStart } = getStartingCoordinates(currentMap);
    
    playerPosRef.current = pacmanStart;
    ghostsPosRef.current = ghostsStart;
    notifyListeners();

    playerDirRef.current = { x: 1, z: 0 };
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    waveTimerRef.current = 0;
    setActiveBonus(null); 
    if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
}, [level, notifyListeners]);


  const startGame = () => {
    resumeAudioContext();
    if (gameStatus === 'idle' || gameStatus === 'gameover' || gameStatus === 'won') {
        restartGame();
    } else {
        setGameStatus('ready');
        playIntro();
    }
  };

  const startRound = () => {
    resumeAudioContext();
    setGameStatus('playing');
  };

  const pauseGame = () => { if (gameStatus === 'playing') setGameStatus('paused'); };
  const resumeGame = () => { if (gameStatus === 'paused') setGameStatus('playing'); };
  
  const restartGame = () => {
    resumeAudioContext();
    if (powerModeTimerRef.current) clearTimeout(powerModeTimerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);

    const freshData = getInitialPositions(1);
    
    playerPosRef.current = freshData.pacmanStart;
    ghostsPosRef.current = freshData.ghostsStart;
    notifyListeners();

    setLayout(freshData.initialLayout);
    layoutRef.current = freshData.initialLayout;
    setRemainingFood(freshData.foodCount); 
    setDotsEaten(0); 
    setScore(0);
    setLives(MAX_LIVES); 
    setLevel(1);        
    setGhostsEatenBatch(0);
    
    setActiveBonus(null);
    setExtraLifeSpawned(false);
    
    setElapsedTime(0);

    setGameStatus('ready'); 
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    waveTimerRef.current = 0;
    playerDirRef.current = { x: 1, z: 0 };

    playIntro(); 
  };

  const nextLevel = () => {
      const nextLevelIndex = level + 1;
      const freshData = getInitialPositions(nextLevelIndex);
      
      playerPosRef.current = freshData.pacmanStart;
      ghostsPosRef.current = freshData.ghostsStart;
      notifyListeners();

      setLayout(freshData.initialLayout);
      layoutRef.current = freshData.initialLayout;
      setRemainingFood(freshData.foodCount);
      setDotsEaten(0);
      
      setLevel(nextLevelIndex);
      
      setActiveBonus(null);
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
      setExtraLifeSpawned(false);
      
      setGameStatus('ready'); 
      setGlobalMode('SCATTER');
      setWaveIndex(0);
      waveTimerRef.current = 0;
      playerDirRef.current = { x: 1, z: 0 };
      playLevelUp(); 
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

  const activatePowerMode = useCallback(() => {
    if (powerModeTimerRef.current) clearTimeout(powerModeTimerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setGhostsEatenBatch(0);
    
    ghostsPosRef.current = ghostsPosRef.current.map(g => {
        if (g.state === GhostState.EATEN || g.state === GhostState.EYES) return g;
        return { 
            ...g, 
            state: GhostState.SCARED,
            currentDir: { x: -g.currentDir.x, z: -g.currentDir.z }, 
            movementProgress: 1 - g.movementProgress 
        };
    });
    notifyListeners();

    const DURATION = 7000;
    const FLASH_START = DURATION - 2000; 

    flashTimerRef.current = setTimeout(() => {
        ghostsPosRef.current = ghostsPosRef.current.map(g => {
            if (g.state === GhostState.SCARED) return { ...g, state: GhostState.FLASHING };
            return g;
        });
        notifyListeners();
    }, FLASH_START);

    powerModeTimerRef.current = setTimeout(() => {
        ghostsPosRef.current = ghostsPosRef.current.map(g => {
            if (g.state === GhostState.SCARED || g.state === GhostState.FLASHING) {
                return { ...g, state: GhostState.NORMAL };
            }
            return g;
        });
        notifyListeners();
        setGhostsEatenBatch(0);
    }, DURATION);
  }, [notifyListeners]);

  const handleCollisionHit = useCallback((hitGhost: Ghost, hitGhostIndex: number) => {
    if (collisionProcessedRef.current) return;

    if (hitGhost.state === GhostState.NORMAL) {
        collisionProcessedRef.current = true;
        if (lives > 1) {
            playDeath(); 
            setLives(prev => prev - 1);
            setGameStatus('ready'); 
            softReset(); 
            if (navigator.vibrate) navigator.vibrate(500); 
        } else {
            playDeath(); 
            setLives(0);
            setGameStatus('gameover');
            if (navigator.vibrate) navigator.vibrate(1000);
        }
    } 
    else if (hitGhost.state === GhostState.SCARED || hitGhost.state === GhostState.FLASHING) {
        playEatGhost(); 
        const comboMultiplier = Math.pow(2, ghostsEatenBatch);
        const points = 200 * comboMultiplier;
        setScore(s => s + points);
        setGhostsEatenBatch(prev => prev + 1);
        
        const newGhosts = [...ghostsPosRef.current];
        if (newGhosts[hitGhostIndex]) {
            newGhosts[hitGhostIndex] = { ...hitGhost, state: GhostState.EATEN, movementProgress: 0 };
        }
        ghostsPosRef.current = newGhosts;
        notifyListeners();
    }
}, [lives, ghostsEatenBatch, softReset, playDeath, playEatGhost, notifyListeners]);


  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (gameStatus !== 'playing') return;
    
    if (targetZ === TUNNEL_ROW) {
        if (targetX < 0) targetX = 18;
        else if (targetX > 18) targetX = 0;
    }

    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    if (layout[targetZ][targetX] === TileType.WALL) return;

    const dx = targetX - playerPosRef.current.x;
    const dz = targetZ - playerPosRef.current.z;
    if (dx !== 0 || dz !== 0) playerDirRef.current = { x: dx, z: dz };

    const newPos = { x: targetX, z: targetZ };
    
    playerPosRef.current = newPos;
    notifyListeners();

    const { hit, hitGhostIndex, hitGhost } = checkCollision(newPos, ghostsPosRef.current);
    if (hit && hitGhost) {
        handleCollisionHit(hitGhost, hitGhostIndex);
        if (hitGhost.state === GhostState.NORMAL) return; 
    }

    const foodResult = checkFoodEaten(newPos, layoutRef.current);

    if (foodResult.hasEaten) {
      layoutRef.current = foodResult.newLayout;
      const newDots = dotsEaten + 1;
      setDotsEaten(newDots); 
      setScore(s => s + foodResult.points);
      setLayout(foodResult.newLayout);

      if (foodResult.eatenType === TileType.FOOD) {
          playChomp(); 
      } else if (foodResult.eatenType === TileType.POWER_PELLET) {
          activatePowerMode(); 
          playPowerPellet(); 
      }

      if (newDots === 30) spawnBonus('CHERRY');
      if (newDots === 60) spawnBonus('STRAWBERRY');
      if (newDots === 90 && !extraLifeSpawned && lives < MAX_LIVES) {
          spawnBonus('EXTRA_LIFE');
          setExtraLifeSpawned(true);
          playExtraLife(); 
      }
      
      setRemainingFood(prev => {
          const newState = prev - 1;
          if (newState <= 0) setGameStatus('won'); 
          return newState;
      });
    }

    if (checkBonusEaten(newPos, activeBonus)) {
      setScore(s => s + activeBonus!.points); 
      if (activeBonus!.type === 'EXTRA_LIFE') {
          setLives(l => Math.min(l + 1, MAX_LIVES)); 
          playExtraLife(); 
      } else {
          playFruit(); 
      }

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
      setActiveBonus(null); 
    }

  }, [layout, gameStatus, dotsEaten, lives, extraLifeSpawned, spawnBonus, playChomp, playExtraLife, playFruit, playPowerPellet, activeBonus, notifyListeners, activatePowerMode, handleCollisionHit]);


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

      while (accumulator >= TICK_RATE) {
        accumulator -= TICK_RATE;

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
                      
                      ghostsPosRef.current = ghostsPosRef.current.map(g => {
                          if (g.state === GhostState.NORMAL) return { ...g, currentDir: { x: -g.currentDir.x, z: -g.currentDir.z } };
                          return g;
                      });
                      hasPositionChanged = true;
                  }
              }
          }
        }

        const prevGhosts = ghostsPosRef.current;
        const updatedGhosts = prevGhosts.map((g) => {
          const speed = getGhostSpeed(g, remainingFood);
          let newProgress = g.movementProgress + speed;

          if (newProgress >= 1) {
             newProgress -= 1; 
             if (g.state === GhostState.EATEN || g.state === GhostState.EYES) {
                 const dist = Math.abs(g.x - g.startX) + Math.abs(g.z - g.startZ);
                 if (dist < 0.5) return { ...g, state: GhostState.NORMAL, movementProgress: 0 };
             }
             const isElroy = g.color === GHOST_CONFIG.BLINKY.color && remainingFood <= 20;
             const checkCanLeave = (ghost: Ghost, eatenCount: number) => {
                if (ghost.color === GHOST_CONFIG.BLINKY.color) return true;
                if (ghost.color === GHOST_CONFIG.PINKY.color) return true; 
                if (ghost.color === GHOST_CONFIG.INKY.color && eatenCount >= 30) return true;
                if (ghost.color === GHOST_CONFIG.CLYDE.color && eatenCount >= 60) return true;
                return false;
             };
             const canLeave = checkCanLeave(g, dotsEaten);

             const moveResult = calculateGhostNextMove(
               g, prevGhosts, playerPosRef.current, playerDirRef.current, layoutRef.current,
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
  }, [gameStatus, settings.difficulty, remainingFood, globalMode, waveIndex, dotsEaten, lives, ghostsEatenBatch, softReset, playDeath, playEatGhost, notifyListeners, handleCollisionHit]);

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
      playerPosRef, ghostsPosRef, subscribeToPositions, layoutRef,
      score, layout, gameStatus, remainingFood, lives, level, activeBonus, elapsedTime,
      movePlayer, startGame, startRound, pauseGame, resumeGame, restartGame, nextLevel 
    }}>
      {children}
    </GameContext.Provider>
  );
};