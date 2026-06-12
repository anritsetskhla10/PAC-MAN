import { useState, useEffect, useRef } from 'react';
import { useGameRefs } from '../context/GameContext';

export type PlayerHeading = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const usePlayerHeading = () => {
  const { playerPosRef, subscribeToPositions } = useGameRefs();
  
  const [heading, setHeading] = useState<PlayerHeading>('RIGHT');
  
  const prevPos = useRef<{ x: number, z: number } | null>(null);

  useEffect(() => {
    if (!prevPos.current && playerPosRef.current) {
        prevPos.current = { x: playerPosRef.current.x, z: playerPosRef.current.z };
    }

    return subscribeToPositions(() => {
      const currentPos = playerPosRef.current;
      const prev = prevPos.current;

      if (!prev) return;

      const dx = currentPos.x - prev.x;
      const dz = currentPos.z - prev.z;
      
      if (dx !== 0 || dz !== 0) {
        let newHeading = heading;
        const isTunnelJump = Math.abs(dx) > 1; 

        if (isTunnelJump) {
             if (dx > 0) newHeading = 'LEFT';
             else newHeading = 'RIGHT';
        } else {
             if (dx > 0) newHeading = 'RIGHT';
             else if (dx < 0) newHeading = 'LEFT';
             else if (dz > 0) newHeading = 'DOWN';
             else if (dz < 0) newHeading = 'UP';
        }

        if (newHeading !== heading) {
          setHeading(newHeading);
        }
        
        prevPos.current = { x: currentPos.x, z: currentPos.z };
      }
    });
  }, [subscribeToPositions, heading, playerPosRef]);

  return heading;
};