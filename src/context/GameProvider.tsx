import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost, type GlobalMode, type ActiveBonus, type BonusType } from '../types';
import { LEVEL_MAPS, GHOST_CONFIG, SPAWN_POINTS, TUNNEL_ROW } from '../utils/constants';
import { useTheme } from './ThemeContext';
import { useGameAudio } from '../hooks/useGameAudio'; 
import { checkCollision, checkFoodEaten, checkBonusEaten } from '../utils/physics';
import { Howler } from 'howler';
import { useGameTimers } from '../hooks/useGameTimers';
import { useGameLoop } from '../hooks/useGameLoop';

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
  const [, setGhostsEatenBatch] = useState<number>(0); 
  const [globalMode, setGlobalMode] = useState<GlobalMode>('SCATTER');
  const [waveIndex, setWaveIndex] = useState(0);

  const [activeBonus, setActiveBonus] = useState<ActiveBonus | null>(null);
  const [extraLifeSpawned, setExtraLifeSpawned] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const playerPosRef = useRef<Position>(pacmanStart);
  const playerDirRef = useRef<Position>({ x: 1, z: 0 }); 
  const ghostsPosRef = useRef<Ghost[]>(ghostsStart);
  const layoutRef = useRef(layout);
  const collisionProcessedRef = useRef(false);

  const listenersRef = useRef<Set<() => void>>(new Set());
  const notifyListeners = useCallback(() => {
      listenersRef.current.forEach(listener => listener());
  }, []);
  const subscribeToPositions = useCallback((callback: () => void) => {
      listenersRef.current.add(callback);
      return () => listenersRef.current.delete(callback);
  }, []);

  const { 
    powerModeTimerRef, flashTimerRef, bonusTimerRef, waveTimerRef,
    clearPowerTimers, clearBonusTimer, clearAllTimers, resetWaveTimer 
  } = useGameTimers();

  const gameStateRef = useRef({ remainingFood, dotsEaten, globalMode, waveIndex, difficulty: settings.difficulty });

  useEffect(() => { layoutRef.current = layout; }, [layout]);

  useEffect(() => {
    gameStateRef.current = { remainingFood, dotsEaten, globalMode, waveIndex, difficulty: settings.difficulty };
  }, [remainingFood, dotsEaten, globalMode, waveIndex, settings.difficulty]);

  const resumeAudioContext = () => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  };

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
    clearBonusTimer();
    
    const randomIndex = Math.floor(Math.random() * SPAWN_POINTS.length);
    const spawnPos = SPAWN_POINTS[randomIndex];

    let points = 0;
    if (type === 'CHERRY') points = 100;
    if (type === 'STRAWBERRY') points = 300;
    if (type === 'EXTRA_LIFE') points = 200;

    setActiveBonus({ type, x: spawnPos.x, z: spawnPos.z, points, expiresAt: Date.now() + 15000 });

    bonusTimerRef.current = setTimeout(() => {
        setActiveBonus(null);
    }, 15000);
  }, [clearBonusTimer, bonusTimerRef]);

  const softReset = useCallback(() => {
    collisionProcessedRef.current = false;
    setLevel(prevLevel => {
        const mapIndex = (prevLevel - 1) % LEVEL_MAPS.length;
        const currentMap = LEVEL_MAPS[mapIndex];
        const { pacmanStart, ghostsStart } = getStartingCoordinates(currentMap);
        
        playerPosRef.current = pacmanStart;
        ghostsPosRef.current = ghostsStart;
        notifyListeners();
        return prevLevel;
    });

    playerDirRef.current = { x: 1, z: 0 };
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    resetWaveTimer();
    setActiveBonus(null); 
    clearBonusTimer();
  }, [notifyListeners, clearBonusTimer, resetWaveTimer]);

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
    clearAllTimers();

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
    resetWaveTimer();
    playerDirRef.current = { x: 1, z: 0 };

    playIntro(); 
  };

  const nextLevel = () => {
      setLevel(prevLevel => {
          const nextLevelIndex = prevLevel + 1;
          const freshData = getInitialPositions(nextLevelIndex);
          
          playerPosRef.current = freshData.pacmanStart;
          ghostsPosRef.current = freshData.ghostsStart;
          notifyListeners();

          setLayout(freshData.initialLayout);
          layoutRef.current = freshData.initialLayout;
          setRemainingFood(freshData.foodCount);
          setDotsEaten(0);
          
          setActiveBonus(null);
          clearBonusTimer();
          setExtraLifeSpawned(false);
          
          setGameStatus('ready'); 
          setGlobalMode('SCATTER');
          setWaveIndex(0);
          resetWaveTimer();
          playerDirRef.current = { x: 1, z: 0 };
          playLevelUp(); 
          
          return nextLevelIndex;
      });
  };

  const activatePowerMode = useCallback(() => {
    clearPowerTimers();
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
  }, [clearPowerTimers, notifyListeners, flashTimerRef, powerModeTimerRef]);

  const handleCollisionHit = useCallback((hitGhost: Ghost, hitGhostIndex: number) => {
    if (collisionProcessedRef.current) return;

    if (hitGhost.state === GhostState.NORMAL) {
        collisionProcessedRef.current = true;
        setLives(prev => {
            if (prev > 1) {
                playDeath(); 
                setGameStatus('ready'); 
                softReset(); 
                if (navigator.vibrate) navigator.vibrate(500); 
                return prev - 1;
            } else {
                playDeath(); 
                setGameStatus('gameover');
                if (navigator.vibrate) navigator.vibrate(1000);
                return 0;
            }
        });
    } 
    else if (hitGhost.state === GhostState.SCARED || hitGhost.state === GhostState.FLASHING) {
        playEatGhost(); 
        setGhostsEatenBatch(prev => {
            const comboMultiplier = Math.pow(2, prev);
            const points = 200 * comboMultiplier;
            setScore(s => s + points);
            return prev + 1;
        });
        
        const newGhosts = [...ghostsPosRef.current];
        if (newGhosts[hitGhostIndex]) {
            newGhosts[hitGhostIndex] = { ...hitGhost, state: GhostState.EATEN, movementProgress: 0 };
        }
        ghostsPosRef.current = newGhosts;
        notifyListeners();
    }
  }, [softReset, playDeath, playEatGhost, notifyListeners]);

  useGameLoop({
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
    handleCollisionHit
  });

  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (gameStatus !== 'playing') return;
    
    if (targetZ === TUNNEL_ROW) {
        if (targetX < 0) targetX = 18;
        else if (targetX > 18) targetX = 0;
    }

    if (!layoutRef.current[targetZ] || layoutRef.current[targetZ][targetX] === undefined) return;
    if (layoutRef.current[targetZ][targetX] === TileType.WALL) return;

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
      setLayout(foodResult.newLayout);
      layoutRef.current = foodResult.newLayout;
      
      setDotsEaten(prev => {
          const newDots = prev + 1;
          if (newDots === 30) spawnBonus('CHERRY');
          if (newDots === 60) spawnBonus('STRAWBERRY');
          
          setLives(currentLives => {
              if (newDots === 90 && !extraLifeSpawned && currentLives < MAX_LIVES) {
                  spawnBonus('EXTRA_LIFE');
                  setExtraLifeSpawned(true);
                  playExtraLife(); 
              }
              return currentLives;
          });
          return newDots;
      }); 

      setScore(s => s + foodResult.points);

      if (foodResult.eatenType === TileType.FOOD) {
          playChomp(); 
      } else if (foodResult.eatenType === TileType.POWER_PELLET) {
          activatePowerMode(); 
          playPowerPellet(); 
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
      clearBonusTimer();
      setActiveBonus(null); 
    }

  }, [gameStatus, extraLifeSpawned, spawnBonus, playChomp, playExtraLife, playFruit, playPowerPellet, activeBonus, notifyListeners, activatePowerMode, handleCollisionHit, clearBonusTimer]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
         setGameStatus(prev => {
             if (prev === 'playing') return 'paused';
             if (prev === 'paused') return 'playing';
             return prev;
         });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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