import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { GameContext, type Position } from './GameContext';
import { type GameStatus, TileType } from '../types';
import { LEVEL_MAP } from '../utils/constants';
import { calculateGhostNextMove } from '../utils/ghostLogic';

// --- საწყისი პოზიციების დალაგება ---
const getInitialPositions = () => {
  let pacmanStart: Position = { x: 1, z: 1 };
  const ghostsStart: Position[] = [];
  
  // ვქმნით რუკის  ასლს, რომ რესტარტისას საჭმელები აღდგეს
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
  // მონაცემების ინიციალიზაცია
  const { pacmanStart, ghostsStart, initialLayout } = getInitialPositions();

  // --- STATE ---
  const [playerPos, setPlayerPos] = useState<Position>(pacmanStart);
  const [ghostsPos, setGhostsPos] = useState<Position[]>(ghostsStart);
  const [layout, setLayout] = useState<number[][]>(initialLayout);
  const [score, setScore] = useState<number>(0);
  
  // თამაშის სტატუსი (ვიწყებთ 'idle'-ით, ანუ მენიუთი)
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  // --- REFS (მნიშვნელოვანია Game Loop-ისთვის) ---
  // ვიყენებთ Refs-ს, რომ useEffect-ში ყოველთვის გვქონდეს განახლებული მონაცემები
  // ისე, რომ ტაიმერები არ დავარესტარტოთ.
  const playerPosRef = useRef(playerPos);
  const layoutRef = useRef(layout);

  // რეფების სინქრონიზაცია სტეიტთან
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);


  // --- GAME CONTROLS ---
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
    setScore(0);
    setGameStatus('playing'); 
  };


  // --- PLAYER MOVEMENT LOGIC ---
  const movePlayer = useCallback((targetX: number, targetZ: number) => {
    // მოძრაობს მხოლოდ მაშინ, თუ სტატუსი არის 'playing'
    if (gameStatus !== 'playing') return;

    // საზღვრების შემოწმება
    if (!layout[targetZ] || layout[targetZ][targetX] === undefined) return;
    
    const targetTile = layout[targetZ][targetX];

    // კედელი
    if (targetTile === TileType.WALL) return;

    // საჭმელი
    if (targetTile === TileType.FOOD) {
      setScore((prev) => prev + 10);
      
      // რუკის განახლება (საჭმლის წაშლა)
      setLayout((prevLayout) => {
        const newLayout = prevLayout.map((row) => [...row]);
        newLayout[targetZ][targetX] = TileType.EMPTY;
        return newLayout;
      });
    }

    // პოზიციის განახლება
    setPlayerPos({ x: targetX, z: targetZ });
  }, [layout, gameStatus]);


  // ---  GHOST AI LOGIC ---
  useEffect(() => {
    // ტაიმერი მუშაობს მხოლოდ 'playing' რეჟიმში
    if (gameStatus !== 'playing') return;

    const moveInterval = setInterval(() => {
      setGhostsPos((prevGhosts) => {
        // გავდივართ ყველა მოჩვენებაზე
        return prevGhosts.map((ghostPos, index) => {
          return calculateGhostNextMove(
            ghostPos, 
            index, 
            playerPosRef.current, 
            layoutRef.current
          );
        });
      });
    }, 400); // მოჩვენებების სიჩქარე (400ms)

    return () => clearInterval(moveInterval);
  }, [gameStatus]);


  // ---  COLLISION DETECTION ---
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const hit = ghostsPos.some(ghost => ghost.x === playerPos.x && ghost.z === playerPos.z);

    if (hit) {
      // setTimeout(0) გვჭირდება, რომ ავირიდოთ React Warning (setState during render)
      setTimeout(() => {
        setGameStatus('gameover');
        console.log("GAME OVER!");
      }, 0);
    }
  }, [playerPos, ghostsPos, gameStatus]);


  // ---  KEYBOARD SHORTCUTS (ESC) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (gameStatus === 'playing') {
          setGameStatus('paused');
          // 3D რეჟიმში მაუსის გამოჩენა
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
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
      playerPos, 
      ghostsPos, 
      score, 
      layout, 
      gameStatus, 
      
      movePlayer, 
      startGame, 
      pauseGame, 
      resumeGame, 
      restartGame 
    }}>
      {children}
    </GameContext.Provider>
  ); 
};