import { useState } from 'react';
import { useGame } from '../context/GameContext';

export type PlayerHeading = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const usePlayerHeading = () => {
  const { playerPos } = useGame();
  
  const [state, setState] = useState({
    prevPos: playerPos,
    heading: 'RIGHT' as PlayerHeading
  });

  if (playerPos !== state.prevPos) {
    const dx = playerPos.x - state.prevPos.x;
    const dz = playerPos.z - state.prevPos.z;
    
    let newHeading = state.heading;

    if (dx !== 0 || dz !== 0) {
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
    }
    setState({
      prevPos: playerPos,
      heading: newHeading
    });
  }

  return state.heading;
};