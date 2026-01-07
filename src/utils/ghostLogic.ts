import { TileType } from '../types';
import type { Position } from '../context/GameContext';

//  ვალიდური მეზობელი უჯრების პოვნა (კედლების გათვალისწინებით)
const getValidNeighbors = (pos: Position, layout: number[][]) => {
  const directions = [
    { x: 0, z: -1 }, // Up
    { x: 0, z: 1 },  // Down
    { x: -1, z: 0 }, // Left
    { x: 1, z: 0 },  // Right
  ];

  return directions
    .map(dir => ({ x: pos.x + dir.x, z: pos.z + dir.z }))
    .filter(p => {
      if (!layout[p.z] || layout[p.z][p.x] === undefined) return false;
      return layout[p.z][p.x] !== TileType.WALL;
    });
};

//  უმოკლეს გზას პოულობს კედლების ავლით
const getNextStepBFS = (start: Position, target: Position, layout: number[][]): Position => {
  if (start.x === target.x && start.z === target.z) return start;

  const queue: { pos: Position; firstStep: Position | null }[] = [
    { pos: start, firstStep: null }
  ];

  const visited = new Set<string>();
  visited.add(`${start.x},${start.z}`);

  while (queue.length > 0) {
    const { pos, firstStep } = queue.shift()!;

    if (pos.x === target.x && pos.z === target.z) {
      return firstStep || start; 
    }

    const neighbors = getValidNeighbors(pos, layout);

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.z}`;

      if (!visited.has(key)) {
        visited.add(key);
        const nextFirstStep = firstStep || neighbor;
        queue.push({ pos: neighbor, firstStep: nextFirstStep });
      }
    }
  }

  const fallback = getValidNeighbors(start, layout);
  return fallback.length > 0 ? fallback[0] : start;
};


// --- მთავარი ფუნქცია ---
export const calculateGhostNextMove = (
  ghost: Position, 
  ghostIndex: number, 
  pacmanPos: Position, 
  layout: number[][]
): Position => {
  
  let target: Position = pacmanPos;

  switch (ghostIndex) {
    case 0: //  წითელი - პირდაპირ პაკმენზე
      target = pacmanPos;
      break;

    case 1: { //  ვარდისფერი - უმიზნებს პაკმენის მარჯვნივ
      const pX = Math.min(layout[0].length - 2, Math.max(1, pacmanPos.x + 2)); 
      target = { x: pX, z: pacmanPos.z };
      break;
    }

    case 2: { //  ცისფერი - რენდომი / პატრული
      const neighbors = getValidNeighbors(ghost, layout);
      if (neighbors.length > 0 && Math.random() > 0.4) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      target = pacmanPos; 
      break;
    }

    case 3: { // ნარინჯისფერი - ახლოს მოდის, მერე გარბის
      const dist = Math.abs(ghost.x - pacmanPos.x) + Math.abs(ghost.z - pacmanPos.z);
      if (dist < 6) {
        target = { x: 1, z: layout.length - 2 }; 
      } else {
        target = pacmanPos;
      }
      break;
    }

    default:
      target = pacmanPos;
  }

  return getNextStepBFS(ghost, target, layout);
};