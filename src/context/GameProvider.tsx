import { useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from 'react';
import {
  GameMetricsContext,
  GameLayoutContext,
  GameSessionContext,
  GameRefsContext,
  GameActionsContext,
  type Position,
} from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost, type GlobalMode, type ActiveBonus, type BonusType } from '../types';
import { LEVEL_MAPS, GHOST_CONFIG, SPAWN_POINTS, TUNNEL_ROW, SCORES, POWER_MODE_DURATION_MS, POWER_MODE_FLASH_START_MS, BONUS_EXPIRATION_MS } from '../utils/constants';
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
  const initialData = useMemo(() => getInitialPositions(1), []);

  const { settings } = useTheme();
  const { playChomp, playDeath, playIntro, stopIntro, playEatGhost, playExtraLife, playFruit, playLevelUp, playPowerPellet } = useGameAudio();

  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [level, setLevel] = useState<number>(1);
  
  const [layout, setLayout] = useState<number[][]>(() => initialData.initialLayout);
  const [remainingFood, setRemainingFood] = useState<number>(() => initialData.foodCount);
  
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle'); 
  const [dotsEaten, setDotsEaten] = useState<number>(0); 
  const [globalMode, setGlobalMode] = useState<GlobalMode>('SCATTER');
  const [waveIndex, setWaveIndex] = useState(0);

  const [activeBonus, setActiveBonus] = useState<ActiveBonus | null>(null);
  const [extraLifeSpawned, setExtraLifeSpawned] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const playerPosRef = useRef<Position>(initialData.pacmanStart);
  const playerDirRef = useRef<Position>({ x: 1, z: 0 });
  const ghostsPosRef = useRef<Ghost[]>(initialData.ghostsStart);
  const layoutRef = useRef(layout);
  const collisionProcessedRef = useRef(false);
  // Mirrors of state so stable callbacks can read the latest value without
  // depending on it and without running side effects inside setState updaters.
  const gameStatusRef = useRef(gameStatus);
  const livesRef = useRef(lives);
  const levelRef = useRef(level);
  const dotsEatenRef = useRef(dotsEaten);
  const extraLifeSpawnedRef = useRef(extraLifeSpawned);

  const ghostsEatenBatchRef = useRef<number>(0);

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
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { dotsEatenRef.current = dotsEaten; }, [dotsEaten]);
  useEffect(() => { extraLifeSpawnedRef.current = extraLifeSpawned; }, [extraLifeSpawned]);

  useEffect(() => {
    gameStateRef.current = { remainingFood, dotsEaten, globalMode, waveIndex, difficulty: settings.difficulty };
  }, [remainingFood, dotsEaten, globalMode, waveIndex, settings.difficulty]);

  const resumeAudioContext = useCallback(() => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  }, []);

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
    if (type === 'CHERRY') points = SCORES.CHERRY;
    if (type === 'STRAWBERRY') points = SCORES.STRAWBERRY;
    if (type === 'EXTRA_LIFE') points = SCORES.EXTRA_LIFE;

    setActiveBonus({ type, x: spawnPos.x, z: spawnPos.z, points, expiresAt: Date.now() + BONUS_EXPIRATION_MS });

    bonusTimerRef.current = setTimeout(() => {
        setActiveBonus(null);
    }, BONUS_EXPIRATION_MS);
  }, [clearBonusTimer, bonusTimerRef]);

  const softReset = useCallback(() => {
    collisionProcessedRef.current = false;

    const mapIndex = (levelRef.current - 1) % LEVEL_MAPS.length;
    const currentMap = LEVEL_MAPS[mapIndex];
    const { pacmanStart, ghostsStart } = getStartingCoordinates(currentMap);

    playerPosRef.current = pacmanStart;
    ghostsPosRef.current = ghostsStart;
    notifyListeners();

    playerDirRef.current = { x: 1, z: 0 };
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    resetWaveTimer();
    setActiveBonus(null); 
    clearBonusTimer();
    ghostsEatenBatchRef.current = 0;
  }, [notifyListeners, clearBonusTimer, resetWaveTimer]);

  const restartGame = useCallback(() => {
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
    dotsEatenRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    setLevel(1);

    setActiveBonus(null);
    setExtraLifeSpawned(false);
    extraLifeSpawnedRef.current = false;
    setElapsedTime(0);

    setGameStatus('ready');
    setGlobalMode('SCATTER');
    setWaveIndex(0);
    resetWaveTimer();
    playerDirRef.current = { x: 1, z: 0 };
    ghostsEatenBatchRef.current = 0;

    playIntro();
  }, [resumeAudioContext, clearAllTimers, notifyListeners, resetWaveTimer, playIntro]);

  const nextLevel = useCallback(() => {
      const nextLevelIndex = levelRef.current + 1;
      const freshData = getInitialPositions(nextLevelIndex);

      playerPosRef.current = freshData.pacmanStart;
      ghostsPosRef.current = freshData.ghostsStart;
      notifyListeners();

      setLevel(nextLevelIndex);
      setLayout(freshData.initialLayout);
      layoutRef.current = freshData.initialLayout;
      setRemainingFood(freshData.foodCount);
      setDotsEaten(0);
      dotsEatenRef.current = 0;

      setActiveBonus(null);
      clearBonusTimer();
      setExtraLifeSpawned(false);
      extraLifeSpawnedRef.current = false;

      setGameStatus('ready');
      setGlobalMode('SCATTER');
      setWaveIndex(0);
      resetWaveTimer();
      playerDirRef.current = { x: 1, z: 0 };
      ghostsEatenBatchRef.current = 0;
      playLevelUp();
  }, [notifyListeners, clearBonusTimer, resetWaveTimer, playLevelUp]);

  const startGame = useCallback(() => {
    resumeAudioContext();
    const status = gameStatusRef.current;
    if (status === 'idle' || status === 'gameover' || status === 'won') {
        restartGame();
    } else {
        setGameStatus('ready');
        playIntro();
    }
  }, [resumeAudioContext, restartGame, playIntro]);

  const startRound = useCallback(() => {
    resumeAudioContext();
    stopIntro(); // stop the intro jingle so it never overlaps the gameplay siren
    setGameStatus('playing');
  }, [resumeAudioContext, stopIntro]);

  const pauseGame = useCallback(() => {
    setGameStatus(prev => (prev === 'playing' ? 'paused' : prev));
  }, []);

  const resumeGame = useCallback(() => {
    setGameStatus(prev => (prev === 'paused' ? 'playing' : prev));
  }, []);

  const activatePowerMode = useCallback(() => {
    clearPowerTimers();
    ghostsEatenBatchRef.current = 0;
    
    ghostsPosRef.current = ghostsPosRef.current.map(g => {
        if (g.state === GhostState.EATEN || g.state === GhostState.EYES) return g;

        const inHouse = (g.x >= 8 && g.x <= 10) && (g.z > 8.5 && g.z < 9.5);
        
        if (inHouse) {
            return { 
                ...g, 
                state: GhostState.SCARED,
                currentDir: { x: -g.currentDir.x, z: -g.currentDir.z } 
            };
        }

        return { 
            ...g, 
            state: GhostState.SCARED,
            x: g.x - g.currentDir.x,
            z: g.z - g.currentDir.z,
            currentDir: { x: -g.currentDir.x, z: -g.currentDir.z }, 
            movementProgress: 1 - g.movementProgress 
        };
    });
    notifyListeners();

    flashTimerRef.current = setTimeout(() => {
        ghostsPosRef.current = ghostsPosRef.current.map(g => {
            if (g.state === GhostState.SCARED) return { ...g, state: GhostState.FLASHING };
            return g;
        });
        notifyListeners();
    }, POWER_MODE_FLASH_START_MS);

    powerModeTimerRef.current = setTimeout(() => {
        ghostsPosRef.current = ghostsPosRef.current.map(g => {
            if (g.state === GhostState.SCARED || g.state === GhostState.FLASHING) {
                return { ...g, state: GhostState.NORMAL };
            }
            return g;
        });
        notifyListeners();
        ghostsEatenBatchRef.current = 0;
    }, POWER_MODE_DURATION_MS);
  }, [clearPowerTimers, notifyListeners, flashTimerRef, powerModeTimerRef]);

  const handleCollisionHit = useCallback((hitGhost: Ghost, hitGhostIndex: number) => {
    if (collisionProcessedRef.current) return;

    if (hitGhost.state === GhostState.NORMAL) {
        collisionProcessedRef.current = true;
        playDeath();
        if (livesRef.current > 1) {
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
    else if (hitGhost.state === GhostState.SCARED || hitGhost.state === GhostState.FLASHING) {
        playEatGhost(); 
        
        const comboMultiplier = Math.pow(2, ghostsEatenBatchRef.current);
        const points = 200 * comboMultiplier;
        setScore(s => s + points);
        
        ghostsEatenBatchRef.current += 1;
        
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
    if (gameStatusRef.current !== 'playing') return;
    
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
      
      const newDots = dotsEatenRef.current + 1;
      dotsEatenRef.current = newDots;
      setDotsEaten(newDots);

      if (newDots === 30) spawnBonus('CHERRY');
      if (newDots === 60) spawnBonus('STRAWBERRY');
      if (newDots === 90 && !extraLifeSpawnedRef.current && livesRef.current < MAX_LIVES) {
          spawnBonus('EXTRA_LIFE');
          extraLifeSpawnedRef.current = true;
          setExtraLifeSpawned(true);
          playExtraLife();
      }

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

  }, [spawnBonus, playChomp, playExtraLife, playFruit, playPowerPellet, activeBonus, notifyListeners, activatePowerMode, handleCollisionHit, clearBonusTimer]);

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

  const metricsValue = useMemo(
    () => ({ score, lives, remainingFood, elapsedTime }),
    [score, lives, remainingFood, elapsedTime]
  );

  const layoutValue = useMemo(
    () => ({ layout, activeBonus }),
    [layout, activeBonus]
  );

  const sessionValue = useMemo(
    () => ({ gameStatus, level }),
    [gameStatus, level]
  );

  const refsValue = useMemo(
    () => ({ playerPosRef, ghostsPosRef, layoutRef, subscribeToPositions }),
    [subscribeToPositions]
  );

  const actionsValue = useMemo(
    () => ({ movePlayer, startGame, startRound, pauseGame, resumeGame, restartGame, nextLevel }),
    [movePlayer, startGame, startRound, pauseGame, resumeGame, restartGame, nextLevel]
  );

  return (
    <GameRefsContext.Provider value={refsValue}>
      <GameActionsContext.Provider value={actionsValue}>
        <GameSessionContext.Provider value={sessionValue}>
          <GameLayoutContext.Provider value={layoutValue}>
            <GameMetricsContext.Provider value={metricsValue}>
              {children}
            </GameMetricsContext.Provider>
          </GameLayoutContext.Provider>
        </GameSessionContext.Provider>
      </GameActionsContext.Provider>
    </GameRefsContext.Provider>
  );
};