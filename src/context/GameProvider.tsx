import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { LEVEL_MAP } from '../utils/constants';
import { TileType } from '../types';
import { calculateGhostNextMove } from '../utils/ghostLogic';

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

  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Position[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    layoutRef.current = layout; 
  }, [layout]);


  // ---  MOVEMENT (Pacman) ---
  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    if (isGameOver) return;

    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    const targetTile = layout[targetZ][targetX];

    if (targetTile === TileType.WALL) return;

    if (targetTile === TileType.FOOD) {
      setScore((prev) => prev + 10);
      setLayout((prevLayout) => {
        const newLayout = prevLayout.map((row) => [...row]);
        newLayout[targetZ][targetX] = TileType.EMPTY;
        return newLayout;
      });
    }

    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, isGameOver]);


  // --- GHOST  ---
  useEffect(() => {
    if (isGameOver) return;

    const moveInterval = setInterval(() => {
      setGhostsPos((prevGhosts) => {
        return prevGhosts.map((ghostPos, index) => {
          
          return calculateGhostNextMove(
            ghostPos, 
            index, 
            playerPosRef.current, 
            layoutRef.current
          );
        });
      });
    }, 400); 

    return () => clearInterval(moveInterval);
  }, [isGameOver]);


  // --- COLLISION ---
  useEffect(() => {
    if (isGameOver) return;

    const hit = ghostsPos.some(ghost => ghost.x === playerPos.x && ghost.z === playerPos.z);

    if (hit) {
      setTimeout(() => {
        setIsGameOver(true);
        console.log("GAME OVER!");
      }, 0);
    }
  }, [playerPos, ghostsPos, isGameOver]);


  const restartGame = () => {
    const freshData = getInitialPositions();
    setPlayerPos(freshData.pacmanStart);
    setGhostsPos(freshData.ghostsStart);
    setLayout(freshData.initialLayout);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <GameContext.Provider value={{ 
      playerPos, setPlayerPos: () => {}, ghostsPos, score, layout, movePlayer, isGameOver, restartGame 
    }}>
      {children}
    </GameContext.Provider>
  ); 
};