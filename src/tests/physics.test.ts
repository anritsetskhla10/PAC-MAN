import { describe, it, expect } from 'vitest';
import { checkCollision, checkFoodEaten, checkBonusEaten } from '../utils/physics';
import { GhostState, TileType, type Ghost, type ActiveBonus } from '../types';

describe('Physics Engine (ფიზიკის ძრავა)', () => {

  //  მოჩვენებებთან შეჯახების ტესტები 
  describe('checkCollision', () => {
    it('უნდა დააფიქსიროს შეჯახება, როცა მოთამაშე და მოჩვენება ზღვარზე ახლოს არიან', () => {
      const playerPos = { x: 5, z: 5 };
      const ghosts: Ghost[] = [
        { x: 5.2, z: 5.2, startX: 1, startZ: 1, color: 'red', state: GhostState.NORMAL, currentDir: { x: 0, z: 0 }, movementProgress: 0 }
      ];
      
      const result = checkCollision(playerPos, ghosts, 0.5);
      expect(result.hit).toBe(true);
      expect(result.hitGhostIndex).toBe(0);
      expect(result.hitGhost?.color).toBe('red');
    });

    it('არ უნდა დააფიქსიროს შეჯახება, როცა მოჩვენება უსაფრთხო დისტანციაზეა', () => {
      const playerPos = { x: 1, z: 1 };
      const ghosts: Ghost[] = [
        { x: 10, z: 10, startX: 1, startZ: 1, color: 'pink', state: GhostState.NORMAL, currentDir: { x: 0, z: 0 }, movementProgress: 0 }
      ];
      
      const result = checkCollision(playerPos, ghosts, 0.5);
      expect(result.hit).toBe(false);
      expect(result.hitGhost).toBeNull();
    });

    it('უნდა მოახდინოს იგნორირება EATEN მდგომარეობაში მყოფ მოჩვენებებზე', () => {
      const playerPos = { x: 5, z: 5 };
      const ghosts: Ghost[] = [
        { x: 5, z: 5, startX: 1, startZ: 1, color: 'cyan', state: GhostState.EATEN, currentDir: { x: 0, z: 0 }, movementProgress: 0 }
      ];
      
      const result = checkCollision(playerPos, ghosts, 0.5);
      expect(result.hit).toBe(false); 
    });
  });

  //  საჭმლის ჭამის ტესტები 
  describe('checkFoodEaten', () => {
    it('უნდა შეჭამოს ჩვეულებრივი წერტილი (FOOD), დააბრუნოს 10 ქულა და გაასუფთაოს უჯრა', () => {
      const playerPos = { x: 1, z: 1 };
      const layout = [
        [1, 1, 1],
        [1, TileType.FOOD, 1],
        [1, 1, 1]
      ];
      
      const result = checkFoodEaten(playerPos, layout);
      
      expect(result.hasEaten).toBe(true);
      expect(result.eatenType).toBe(TileType.FOOD);
      expect(result.points).toBe(10);
      expect(result.newLayout[1][1]).toBe(TileType.EMPTY); 
    });

    it('უნდა შეჭამოს Power Pellet, დააბრუნოს 50 ქულა და გაასუფთაოს უჯრა', () => {
      const playerPos = { x: 1, z: 1 };
      const layout = [
        [1, 1, 1],
        [1, TileType.POWER_PELLET, 1],
        [1, 1, 1]
      ];
      
      const result = checkFoodEaten(playerPos, layout);
      
      expect(result.hasEaten).toBe(true);
      expect(result.eatenType).toBe(TileType.POWER_PELLET);
      expect(result.points).toBe(50);
      expect(result.newLayout[1][1]).toBe(TileType.EMPTY);
    });

    it('არ უნდა ქნას არაფერი, თუ პაკმანი ცარიელ (EMPTY) უჯრაზე დგას', () => {
      const playerPos = { x: 1, z: 1 };
      const layout = [
        [1, 1, 1],
        [1, TileType.EMPTY, 1],
        [1, 1, 1]
      ];
      
      const result = checkFoodEaten(playerPos, layout);
      
      expect(result.hasEaten).toBe(false);
      expect(result.points).toBe(0);
      expect(result.newLayout).toEqual(layout);
    });

    it('უნდა დააბრუნოს უსაფრთხო მნიშვნელობები, თუ პაკმანი რუკის საზღვრებს გარეთაა (Out of bounds)', () => {
      const playerPos = { x: 100, z: -5 }; 
      const layout = [
        [1, 1, 1],
        [1, 0, 1]
      ];
      
      const result = checkFoodEaten(playerPos, layout);
      
      expect(result.hasEaten).toBe(false);
      expect(result.points).toBe(0);
    });
  });

  //  ბონუსების ჭამის ტესტები
  describe('checkBonusEaten', () => {
    it('უნდა დააბრუნოს true, თუ პაკმანის და ბონუსის დამრგვალებული კოორდინატები ემთხვევა', () => {
      // playerPos ოდნავ აცდენილია, მაგრამ Math.round()-ით 5 და 8 გამოვა
      const playerPos = { x: 5.2, z: 7.9 };
      const activeBonus: ActiveBonus = { type: 'CHERRY', x: 5, z: 8, points: 100, expiresAt: Date.now() + 10000 };
      
      const result = checkBonusEaten(playerPos, activeBonus);
      expect(result).toBe(true);
    });

    it('უნდა დააბრუნოს false, თუ კოორდინატები არ ემთხვევა', () => {
      const playerPos = { x: 5, z: 8 };
      const activeBonus: ActiveBonus = { type: 'STRAWBERRY', x: 1, z: 1, points: 300, expiresAt: Date.now() + 10000 };
      
      const result = checkBonusEaten(playerPos, activeBonus);
      expect(result).toBe(false);
    });

    it('უნდა დააბრუნოს false, თუ აქტიური ბონუსი არ არსებობს (null)', () => {
      const playerPos = { x: 5, z: 8 };
      const result = checkBonusEaten(playerPos, null);
      expect(result).toBe(false);
    });
  });

});