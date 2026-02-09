import { describe, it, expect } from 'vitest';
import { calculateGhostNextMove } from '../utils/ghostLogic';
import { TileType, GhostState } from '../types'; 

const createMockGhost = (x: number, z: number, dir = { x: 1, z: 0 }) => ({
  x, z, startX: x, startZ: z,
  color: 'red', state: GhostState.NORMAL,
  currentDir: dir, movementProgress: 0
});

describe('Ghost Logic', () => {

  it('should return a valid move and not walk into a wall', () => {
    const hallwayLayout = [
        [1, 1, 1, 1],
        [1, 0, 0, 1], 
        [1, 1, 1, 1]
    ];
    
    const ghost = createMockGhost(1, 1, { x: 1, z: 0 }); 
    const playerPos = { x: 3, z: 1 };

    const result = calculateGhostNextMove(
        ghost, 
        [], 
        playerPos, 
        { x: 0, z: 0 }, 
        hallwayLayout, 
        'EASY', 
        'CHASE', 
        false, 
        true 
    );

    const tileAtNextPos = hallwayLayout[result.nextPos.z][result.nextPos.x];
    
    expect(tileAtNextPos).not.toBe(TileType.WALL);
    
    expect(result.nextPos.x).toBe(2);
    expect(result.nextPos.z).toBe(1);
  });
});