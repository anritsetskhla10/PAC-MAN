import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType } from '../types';
import { LEVEL_MAP, SCORES } from '../utils/constants';
import { calculateGhostNextMove } from '../utils/ghostLogic';

// --- საწყისი პოზიციების დალაგება ---
const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 };
  const ghostsStart: Position[] = [];
  
  const initialLayout = LEVEL_MAP.map(row => [...row]);

  LEVEL_MAP.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile === TileType.PACMAN_START) { 
        pacmanStart = { x: colIndex, z: rowIndex };
      }
      if (tile === TileType.GHOST_START) {
        ghostsStart.push({ x: colIndex, z: rowIndex });
      }
    });
  });

  return { pacmanStart, ghostsStart, initialLayout };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { pacmanStart, ghostsStart, initialLayout } = getInitialPositions();

  // --- STATE ---
  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Position[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  // --- REFS ---
  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);

  // --- CONTROLS ---
  const startGame = () => setGameStatus('playing');
  const pauseGame = () => { if (gameStatus === 'playing') setGameStatus('paused'); };
  const resumeGame = () => { if (gameStatus === 'paused') setGameStatus('playing'); };
  const restartGame = () => {
    const freshData = getInitialPositions();
    setPlayerPos(freshData.pacmanStart);
    setGhostsPos(freshData.ghostsStart);
    setLayout(freshData.initialLayout);
    setScore(0);
    setGameStatus('playing'); 
  };

  // --- PLAYER MOVEMENT ---
  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (gameStatus !== 'playing') return;
    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    
    const targetTile = layout[targetZ][targetX];
    
    // კედელს ვერ გაივლის
    if (targetTile === TileType.WALL) return;

    // ვამოწმებთ, არის თუ არა უჯრა საჭმელი
    const isFood = 
      targetTile === TileType.FOOD || 
      targetTile === TileType.POWER_PELLET || 
      targetTile === TileType.CHERRY || 
      targetTile === TileType.STRAWBERRY;

    if (isFood) {
      //  ქულების დათვლა ტიპის მიხედვით
      let pointsToAdd = 0;
      
      switch (targetTile) {
        case TileType.FOOD:
          pointsToAdd = SCORES.DOT;
          break;
        case TileType.POWER_PELLET:
          pointsToAdd = SCORES.POWER_PELLET;
          break;
        case TileType.CHERRY:
          pointsToAdd = SCORES.CHERRY;
          break;
        case TileType.STRAWBERRY:
          pointsToAdd = SCORES.STRAWBERRY;
          break;
      }

      setScore((prev) => prev + pointsToAdd);

      //  საჭმლის გაქრობა რუკიდან (ხდება EMPTY)
      setLayout((prevLayout) => {
        const newLayout = prevLayout.map((row) => [...row]);
        newLayout[targetZ][targetX] = TileType.EMPTY;
        return newLayout;
      });
    }

    // პოზიციის შეცვლა
    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, gameStatus]);

  // --- GHOST AI LOGIC ---
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const moveInterval = setInterval(() => {
      setGhostsPos((prevGhosts) => {
        if (!prevGhosts || prevGhosts.length === 0) return prevGhosts;

        const nextPositions = [...prevGhosts];

        for (let i = 0; i < prevGhosts.length; i++) {
          const ghost = prevGhosts[i];
          if (!ghost) continue;

          const newMove = calculateGhostNextMove(
            ghost, 
            i, 
            playerPosRef.current, 
            layoutRef.current,
            nextPositions 
          );

          nextPositions[i] = newMove;
        }
        return nextPositions;
      });
    }, 400); // სიჩქარე

    return () => clearInterval(moveInterval);
  }, [gameStatus]);

  // --- COLLISION DETECTION ---
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const hit = ghostsPos.some(ghost => ghost && ghost.x === playerPos.x && ghost.z === playerPos.z);

    if (hit) {
      setTimeout(() => {
        setGameStatus('gameover');
      }, 0);
    }
  }, [playerPos, ghostsPos, gameStatus]);

  // --- KEYBOARD LISTENERS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (gameStatus === 'playing') {
          setGameStatus('paused');
          if (document.pointerLockElement) document.exitPointerLock();
        } else if (gameStatus === 'paused') {
          setGameStatus('playing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus]);

  return (
    <GameContext.Provider value={{ 
      playerPos, ghostsPos, score, layout, gameStatus, 
      movePlayer, startGame, pauseGame, resumeGame, restartGame 
    }}>
      {children}
    </GameContext.Provider>
  ); 
};