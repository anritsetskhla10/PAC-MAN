import {useRef } from 'react';
import { useGame } from '../context/GameContext';

export const SwipeControls = () => {
  const { movePlayer, playerPos, gameStatus } = useGame();
  
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 30; 

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null; 
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (Math.abs(distanceX) < minSwipeDistance && Math.abs(distanceY) < minSwipeDistance) return;

    let dX = 0;
    let dZ = 0;

    if (isHorizontal) {
      if (distanceX > 0) dX = -1; // Left
      else dX = 1;                // Right
    } else {
      if (distanceY > 0) dZ = -1; // Up
      else dZ = 1;                // Down
    }

    if (gameStatus === 'playing') {
       movePlayer(Math.round(playerPos.x + dX), Math.round(playerPos.z + dZ));
       
       if (navigator.vibrate) navigator.vibrate(5); 
    }
  };

  return (
    <div 
      className="absolute inset-0 z-40 touch-none" 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
};