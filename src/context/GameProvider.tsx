import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType, GhostState, type Ghost } from '../types';
import { LEVEL_MAP, SCORES } from '../utils/constants'; 
import { calculateGhostNextMove } from '../utils/ghostLogic'; 

const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 };
  const ghostsStart: Ghost[] = [];
  const initialLayout = LEVEL_MAP.map(row => [...row]); 
  let foodCount = 0; 

  LEVEL_MAP.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile === TileType.PACMAN_START) {
         pacmanStart = { x: colIndex, z: rowIndex };
      }
      if (tile === TileType.GHOST_START) {
        ghostsStart.push({ 
            x: colIndex, z: rowIndex, startX: colIndex, startZ: rowIndex,
            color: 'red', state: GhostState.NORMAL 
        });
      }
      if (
        tile === TileType.FOOD || 
        tile === TileType.POWER_PELLET || 
        tile === TileType.CHERRY || 
        tile === TileType.STRAWBERRY
      ) {
        foodCount++;
      }
    });
  });

  return { pacmanStart, ghostsStart, initialLayout, foodCount };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart, initialLayout, foodCount } = getInitialPositions();

  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Ghost[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing'); 
  const [remainingFood, setRemainingFood] = useState<number>(foodCount); 

  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);

  // --- CONTROLS ---
  const startGame = () => setGameStatus('playing');
  
  const pauseGame = () => { 
    if (gameStatus === 'playing') setGameStatus('paused'); 
  };
  
  const resumeGame = () => { 
    if (gameStatus === 'paused') setGameStatus('playing'); 
  };
  
  const restartGame = () => {
    const freshData = getInitialPositions();
    setPlayerPos(freshData.pacmanStart);
    setGhostsPos(freshData.ghostsStart);
    setLayout(freshData.initialLayout);
    setRemainingFood(freshData.foodCount); 
    setScore(0);
    setGameStatus('playing'); 
  };

  // --- POWER MODE ---
  const activatePowerMode = () => {
    setGhostsPos(prev => prev.map(g => {
        if (g.state !== GhostState.EATEN) {
            return { ...g, state: GhostState.SCARED };
        }
        return g;
    }));

    setTimeout(() => {
        setGhostsPos(prev => prev.map(g => {
            if (g.state === GhostState.SCARED) {
                return { ...g, state: GhostState.NORMAL };
            }
            return g;
        }));
    }, 10000);
  };

  // --- PLAYER MOVEMENT ---
  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (gameStatus !== 'playing') return;
    
    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    
    const targetTile = layout[targetZ][targetX];
    if (targetTile === TileType.WALL) return;

    const isFood = ([
        TileType.FOOD, TileType.POWER_PELLET, TileType.CHERRY, TileType.STRAWBERRY
    ] as number[]).includes(targetTile);

    if (isFood) {
      let pts = 0;
      if (targetTile === TileType.FOOD) pts = SCORES.DOT;
      if (targetTile === TileType.POWER_PELLET) { pts = SCORES.POWER_PELLET; activatePowerMode(); }
      if (targetTile === TileType.CHERRY) pts = SCORES.CHERRY;
      if (targetTile === TileType.STRAWBERRY) pts = SCORES.STRAWBERRY;
      
      setScore(s => s + pts);

      setLayout(l => {
        const nl = l.map(r => [...r]);
        nl[targetZ][targetX] = TileType.EMPTY;
        return nl;
      });

      setRemainingFood(prev => {
          const newState = prev - 1;
          if (newState <= 0) {
              setGameStatus('won'); 
          }
          return newState;
      });
    }
    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, gameStatus]);

  // --- GHOST LOOP ---
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setGhostsPos(prev => {
        const next = [...prev];
        for (let i = 0; i < prev.length; i++) {
          const g = prev[i];

          if (g.state === GhostState.EATEN) {
             const dist = Math.abs(g.x - g.startX) + Math.abs(g.z - g.startZ);
             if (dist < 0.5) {
                 next[i] = { ...g, state: GhostState.NORMAL };
                 continue;
             }
          }

          const newPos = calculateGhostNextMove(g, i, playerPosRef.current, layoutRef.current, next);
          next[i] = { ...g, x: newPos.x, z: newPos.z };
        }
        return next;
      });
    }, 400); 

    return () => clearInterval(interval);
  }, [gameStatus]);

  // --- COLLISION ---
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const hitIndex = ghostsPos.findIndex(g => Math.round(g.x) === playerPos.x && Math.round(g.z) === playerPos.z);

    if (hitIndex !== -1) {
        const ghost = ghostsPos[hitIndex];
        
        setTimeout(() => {
            if (ghost.state === GhostState.NORMAL) {
                setGameStatus('gameover'); 
            } 
            else if (ghost.state === GhostState.SCARED) {
                setScore(s => s + 200);
                setGhostsPos(prev => {
                    const ng = [...prev];
                    ng[hitIndex] = { ...ghost, state: GhostState.EATEN };
                    return ng;
                });
            }
        }, 0);
    }
  }, [playerPos, ghostsPos, gameStatus]);

  // --- KEYBOARD ---
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