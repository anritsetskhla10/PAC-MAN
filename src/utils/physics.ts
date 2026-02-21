import { type Ghost, type Coordinate as Position, GhostState, TileType, type ActiveBonus } from '../types';

export interface CollisionResult {
  hit: boolean;
  hitGhostIndex: number;
  hitGhost: Ghost | null;
}

// მოჩვენებებთან შეჯახების ლოგიკა
export const checkCollision = (playerPos: Position, ghostsPos: Ghost[], thresholdSq: number = 0.5): CollisionResult => {
  for (let i = 0; i < ghostsPos.length; i++) {
    const ghost = ghostsPos[i];
    
    // შეჭმულ მოჩვენებებთან შეჯახება არ გვჭირდება, ისინი მხოლოდ თვალები არიან და სახლში ბრუნდებიან
    if (ghost.state === GhostState.EATEN) continue;

    const distSq = (playerPos.x - ghost.x) ** 2 + (playerPos.z - ghost.z) ** 2;
    
    // თუ მანძილის კვადრატი დაშვებულ ზღვარზე ნაკლებია, მოხდა შეჯახება
    if (distSq < thresholdSq) {
      return { hit: true, hitGhostIndex: i, hitGhost: ghost };
    }
  }
  return { hit: false, hitGhostIndex: -1, hitGhost: null };
};

export interface FoodCollisionResult {
  hasEaten: boolean;
  eatenType: TileType | null;
  newLayout: number[][];
  points: number;
}

// საჭმლის და Power Pellet-ების ჭამის ლოგიკა
export const checkFoodEaten = (playerPos: Position, currentLayout: number[][]): FoodCollisionResult => {
  const roundedX = Math.round(playerPos.x);
  const roundedZ = Math.round(playerPos.z);

  // რუკის საზღვრების (Out of bounds) უსაფრთხოების შემოწმება
  if (roundedZ < 0 || roundedZ >= currentLayout.length || roundedX < 0 || roundedX >= currentLayout[0].length) {
    return { hasEaten: false, eatenType: null, newLayout: currentLayout, points: 0 };
  }

  const tile = currentLayout[roundedZ][roundedX];
  let points = 0;
  
  if (tile === TileType.FOOD || tile === TileType.POWER_PELLET) {
    // ქულები ახლა აქ არის განმარტებული და ამოღებულია GameProvider-დან
    points = tile === TileType.FOOD ? 10 : 50;
    
    // ვქმნით რუკის ახალ, დამოუკიდებელ ასლს
    const newLayout = currentLayout.map(row => [...row]);
    newLayout[roundedZ][roundedX] = TileType.EMPTY; // ნაჭამი უჯრა ხდება ცარიელი

    return { hasEaten: true, eatenType: tile, newLayout, points };
  }

  return { hasEaten: false, eatenType: null, newLayout: currentLayout, points: 0 };
};

// დინამიური ბონუსების აღების შემოწმება
export const checkBonusEaten = (playerPos: Position, activeBonus: ActiveBonus | null): boolean => {
    if (!activeBonus) return false;
    const roundedX = Math.round(playerPos.x);
    const roundedZ = Math.round(playerPos.z);
    
    return roundedX === activeBonus.x && roundedZ === activeBonus.z;
};