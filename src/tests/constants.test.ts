import { describe, it, expect } from 'vitest';
import { LEVEL_MAPS, SPAWN_POINTS} from '../utils/constants';
import { TileType } from '../types';

describe('Game Constants & Map Configuration', () => {
  
  describe('LEVEL_MAPS Validation', () => {
    it('should have exactly one Pacman Start Point (TileType 3) per map', () => {
      LEVEL_MAPS.forEach((map, index) => {
        let pacmanStartCount = 0;

        map.forEach((row) => {
          row.forEach((tile) => {
            if (tile === TileType.PACMAN_START) {
              pacmanStartCount++;
            }
          });
        });

        if (pacmanStartCount !== 1) {
          console.error(`Map at index ${index} has ${pacmanStartCount} start points!`);
        }

        expect(pacmanStartCount).toBe(1);
      });
    });

    it('should ensure map dimensions are consistent (all rows have same length)', () => {
        LEVEL_MAPS.forEach((map) => {
            const width = map[0].length;
            map.forEach((row) => {
                expect(row.length).toBe(width);
            });
        });
    });
  });

  describe('SPAWN_POINTS Validation', () => {
    it('should ensure all bonus spawn points are on EMPTY tiles (0)', () => {
      const map = LEVEL_MAPS[0]; 

      SPAWN_POINTS.forEach((point, index) => {
        if (!map[point.z] || map[point.z][point.x] === undefined) {
             throw new Error(`Spawn point at index ${index} [${point.x}, ${point.z}] is out of bounds`);
        }

        const tile = map[point.z][point.x];
    
        const isValidTile = tile === TileType.EMPTY;
        
        if (!isValidTile) {
            console.error(`Spawn point at index ${index} [x:${point.x}, z:${point.z}] is on an invalid tile: ${tile}`);
        }

        expect(isValidTile).toBe(true);
      });
    });
  });

});