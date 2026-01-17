import { TileType, GhostState } from '../types'; 
import type { Ghost } from '../types';

interface Position { x: number; z: number; }

// შემოწმება: არის თუ არა უჯრაზე სხვა მოჩვენება
const isOccupiedByGhost = (target: Position, allGhosts: Ghost[]): boolean => {
  if (!allGhosts) return false;
  return allGhosts.some(g => 
    g.state !== GhostState.EATEN && 
    Math.round(g.x) === target.x && 
    Math.round(g.z) === target.z
  );
};

// ვალიდური მეზობელი უჯრები
const getValidNeighbors = (pos: Position, layout: number[][], allGhosts: Ghost[], ignoreGhosts: boolean) => {
  const directions = [{ x: 0, z: -1 }, { x: 0, z: 1 }, { x: -1, z: 0 }, { x: 1, z: 0 }];

  return directions
    .map(dir => ({ x: pos.x + dir.x, z: pos.z + dir.z }))
    .filter(p => {
      //  რუკის საზღვრები
      if (!layout[p.z] || layout[p.z][p.x] === undefined) return false;
      // კედელი
      if (layout[p.z][p.x] === TileType.WALL) return false;
      //  სხვა მოჩვენებები (თუ ignoreGhosts გამორთულია)
      if (!ignoreGhosts && isOccupiedByGhost(p, allGhosts)) return false;
      return true;
    });
};

// BFS (გზის გაგნება)
const getNextStepBFS = (start: Position, target: Position, layout: number[][], allGhosts: Ghost[], ignoreGhosts: boolean): Position => {
  const startInt = { x: Math.round(start.x), z: Math.round(start.z) };
  
  // თუ უკვე ადგილზეა
  if (startInt.x === target.x && startInt.z === target.z) return startInt;

  const queue = [{ pos: startInt, firstStep: null as Position | null }];
  const visited = new Set<string>();
  visited.add(`${startInt.x},${startInt.z}`);

  while (queue.length > 0) {
    const { pos, firstStep } = queue.shift()!;
    
    if (pos.x === target.x && pos.z === target.z) {
      return firstStep || startInt;
    }

    const neighbors = getValidNeighbors(pos, layout, allGhosts, ignoreGhosts);
    for (const n of neighbors) {
      const key = `${n.x},${n.z}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: n, firstStep: firstStep || n });
      }
    }
  }
  // თუ გზა ვერ იპოვა (ჩიხი), უბრალოდ სადმე გადადგას
  const fallback = getValidNeighbors(startInt, layout, allGhosts, ignoreGhosts);
  return fallback.length > 0 ? fallback[0] : startInt;
};

// --- მთავარი ფუნქცია ---
export const calculateGhostNextMove = (
  ghost: Ghost, 
  index: number, 
  playerPos: Position, 
  layout: number[][], 
  allGhosts: Ghost[]
): Position => {
  // EATEN (თვალები) -> მიდის სახლში
  if (ghost.state === GhostState.EATEN) {
    const home = { x: ghost.startX, z: ghost.startZ };
    
    if (Math.abs(ghost.x - home.x) < 0.5 && Math.abs(ghost.z - home.z) < 0.5) {
        return { x: home.x, z: home.z };
    }
    // სახლისკენ მიმავალ გზაზე სხვა მოჩვენებებს აიგნორებს (true)
    return getNextStepBFS(ghost, home, layout, [], true);
  }

  const otherGhosts = allGhosts.filter((_, i) => i !== index);

  //  SCARED -> გარბის პაკმენისგან
  if (ghost.state === GhostState.SCARED) {
    const currentInt = { x: Math.round(ghost.x), z: Math.round(ghost.z) };
    const neighbors = getValidNeighbors(currentInt, layout, otherGhosts, false);
    
    if (neighbors.length === 0) return currentInt;

    // ირჩევს ყველაზე შორს მყოფ უჯრას
    let best = neighbors[0];
    let maxDist = -1;
    for (const n of neighbors) {
      const d = Math.abs(n.x - playerPos.x) + Math.abs(n.z - playerPos.z);
      if (d > maxDist) { maxDist = d; best = n; }
    }
    return best;
  }

  // NORMAL -> მისდევს პაკმენს
  return getNextStepBFS(ghost, playerPos, layout, otherGhosts, false);
};