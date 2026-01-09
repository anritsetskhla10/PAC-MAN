import { TileType } from '../types';
import type { Position } from '../context/GameContext';

// დამხმარე: ამოწმებს, არის თუ არა დაკავებული უჯრა სხვა მოჩვენების მიერ
const isOccupiedByGhost = (target: Position, allGhosts: Position[]): boolean => {
  if (!allGhosts) return false;
  // ghost && ghost.x შემოწმება თავიდან გვაცილებს undefined crash-ს
  return allGhosts.some(ghost => ghost && ghost.x === target.x && ghost.z === target.z);
};

const getValidNeighbors = (pos: Position, layout: number[][], allGhosts: Position[]) => {
  const directions = [
    { x: 0, z: -1 }, { x: 0, z: 1 }, { x: -1, z: 0 }, { x: 1, z: 0 },
  ];

  return directions
    .map(dir => ({ x: pos.x + dir.x, z: pos.z + dir.z }))
    .filter(p => {
      //  რუკის საზღვრები (უსაფრთხოების დამატებით)
      if (!layout || !layout[p.z] || layout[p.z][p.x] === undefined) return false;
      
      //  კედელი
      if (layout[p.z][p.x] === TileType.WALL) return false;
      
      //  სხვა მოჩვენება
      if (isOccupiedByGhost(p, allGhosts)) return false;

      return true;
    });
};

const getNextStepBFS = (
  start: Position, 
  target: Position, 
  layout: number[][], 
  allGhosts: Position[]
): Position => {
  // თუ start არასწორია, ვაბრუნებთ ისევ start-ს
  if (!start || start.x === undefined) return start;
  if (start.x === target.x && start.z === target.z) return start;

  const queue: { pos: Position; firstStep: Position | null }[] = [
    { pos: start, firstStep: null }
  ];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.z}`);

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break; 
    const { pos, firstStep } = item;

    if (pos.x === target.x && pos.z === target.z) {
      return firstStep || start; 
    }

    const neighbors = getValidNeighbors(pos, layout, allGhosts);

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.z}`;
      if (!visited.has(key)) {
        visited.add(key);
        const nextFirstStep = firstStep || neighbor;
        queue.push({ pos: neighbor, firstStep: nextFirstStep });
      }
    }
  }

  // თუ გზა ვერ იპოვა, ვამოწმებთ, შეგვიძლია თუ არა სადმე გადადგმა
  const fallback = getValidNeighbors(start, layout, allGhosts);
  // თუ არცერთი მეზობელი არ არის თავისუფალი, ვბრუნდებით start-ს
  return fallback.length > 0 ? fallback[0] : start;
};

export const calculateGhostNextMove = (
  currentGhostPos: Position, 
  ghostIndex: number, 
  pacmanPos: Position, 
  layout: number[][],
  allGhosts: Position[] 
): Position => {
  // დაცვა:  თუ რომელიმე პოზიცია არასწორია, ვბრუნდებით currentGhostPos-ს
  if (!currentGhostPos || !pacmanPos || !layout) return currentGhostPos;

  // სხვა მოჩვენებები
  const otherGhosts = allGhosts ? allGhosts.filter((_, i) => i !== ghostIndex) : [];

  let target: Position = pacmanPos;

  // AI ლოგიკა
  switch (ghostIndex) {
    case 0: target = pacmanPos; break;
    case 1: { 
      const pX = Math.min((layout[0]?.length || 20) - 2, Math.max(1, pacmanPos.x + 2)); 
      target = { x: pX, z: pacmanPos.z };
      break;
    }
    case 2: { 
      const neighbors = getValidNeighbors(currentGhostPos, layout, otherGhosts);
      if (neighbors.length > 0 && Math.random() > 0.4) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      target = pacmanPos; 
      break;
    }
    case 3: { 
      const dist = Math.abs(currentGhostPos.x - pacmanPos.x) + Math.abs(currentGhostPos.z - pacmanPos.z);
      if (dist < 6) target = { x: 1, z: (layout.length || 15) - 2 }; 
      else target = pacmanPos;
      break;
    }
    default: target = pacmanPos;
  }

  return getNextStepBFS(currentGhostPos, target, layout, otherGhosts);
};