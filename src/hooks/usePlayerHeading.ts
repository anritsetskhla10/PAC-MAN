import { useState, useEffect } from 'react';

export type PlayerHeading = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Hook to capture the player's intended facing direction.
 * This is decoupled from the grid movement logic to ensure visual responsiveness
 * (e.g., turning to face a wall even if movement is blocked).
 */
export const usePlayerHeading = () => {
  // საწყისი პოზიცია მარჯვნივ
  const [heading, setHeading] = useState<PlayerHeading>('RIGHT');

  useEffect(() => {
    const handleInput = (e: KeyboardEvent) => {
      // WASD და ისრების გაერთიანება
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setHeading('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
          setHeading('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setHeading('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          setHeading('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, []);

  return heading;
};