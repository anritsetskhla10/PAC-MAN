import { TileType, GhostState, type Ghost, type Coordinate, type Difficulty, type GlobalMode } from '../types';
import { GHOST_CONFIG, HOUSE_DOOR, TUNNEL_ROW } from './constants';

const DIRECTIONS = [
  { x: 0, z: -1 },
  { x: -1, z: 0 }, 
  { x: 0, z: 1 }, 
  { x: 1, z: 0 },  
];

const getDistSq = (a: Coordinate, b: Coordinate) => {
  return (a.x - b.x) ** 2 + (a.z - b.z) ** 2;
};

const isInGhostHouse = (pos: Coordinate) => {
  return (pos.z > 8.5 && pos.z < 9.5) && (pos.x >= 8 && pos.x <= 10);
};

const isWall = (x: number, z: number, layout: number[][], allowHouse: boolean = false) => {
  if (z < 0 || z >= layout.length || x < 0 || x >= layout[0].length) {
    if (z === TUNNEL_ROW) return false; 
    return true;
  }
  const tile = layout[z][x];
  
  if (allowHouse) {
    if (tile === TileType.GHOST_HOUSE || tile === TileType.GHOST_START) return false;
  }
  
  return tile === TileType.WALL || tile === TileType.GHOST_HOUSE || tile === TileType.GHOST_START;
};

const isRedZone = (x: number, z: number, dir: Coordinate) => {
  if (dir.z === -1) { 
    if ((x >= 8 && x <= 10) && (z === 8 || z === 20)) return true;
  }
  return false;
};

// --- BFS PATHFINDING (Used for Eyes returning home) ---
const getNextStepBFS = (start: Coordinate, target: Coordinate, layout: number[][]): { nextPos: Coordinate, nextDir: Coordinate } => {
  const startX = Math.round(start.x);
  const startZ = Math.round(start.z);
  const targetX = Math.round(target.x);
  const targetZ = Math.round(target.z);

  if (startX === targetX && startZ === targetZ) {
      return { nextPos: start, nextDir: { x: 0, z: 0 } };
  }

  const queue: { x: number, z: number, firstPos: Coordinate | null, firstDir: Coordinate | null }[] = [
    { x: startX, z: startZ, firstPos: null, firstDir: null }
  ];
  const visited = new Set<string>();
  visited.add(`${startX},${startZ}`);

  while (queue.length > 0) {
    const { x, z, firstPos, firstDir } = queue.shift()!;
    if (x === targetX && z === targetZ) {
        return { nextPos: firstPos!, nextDir: firstDir! };
    }

    for (const dir of DIRECTIONS) {
      let nextX = x + dir.x;
      const nextZ = z + dir.z;

      const stepPos = firstPos || { x: nextX, z: nextZ };
      const stepDir = firstDir || dir;

      if (nextZ === TUNNEL_ROW) {
        if (nextX < 0) nextX = layout[0].length - 1;
        else if (nextX >= layout[0].length) nextX = 0;
      }

      const key = `${nextX},${nextZ}`;
      const isPassable = !isWall(nextX, nextZ, layout, true);

      if (!visited.has(key) && isPassable) {
        visited.add(key);
        queue.push({ x: nextX, z: nextZ, firstPos: stepPos, firstDir: stepDir });
      }
    }
  }
  return { nextPos: start, nextDir: { x: 0, z: 0 } };
};

// --- TARGETING ---
const getBlinkyTarget = (playerPos: Coordinate) => playerPos;
const getPinkyTarget = (playerPos: Coordinate, playerDir: Coordinate) => ({
  x: playerPos.x + playerDir.x * 4,
  z: playerPos.z + playerDir.z * 4
});
const getInkyTarget = (playerPos: Coordinate, playerDir: Coordinate, blinkyPos: Coordinate) => {
  const pivotX = playerPos.x + playerDir.x * 2;
  const pivotZ = playerPos.z + playerDir.z * 2;
  return {
    x: blinkyPos.x + (pivotX - blinkyPos.x) * 2,
    z: blinkyPos.z + (pivotZ - blinkyPos.z) * 2
  };
};
const getClydeTarget = (ghostPos: Coordinate, playerPos: Coordinate) => {
  return getDistSq(ghostPos, playerPos) > 64 ? playerPos : GHOST_CONFIG.CLYDE.scatterTarget;
};

// --- MOVEMENT ENGINE ---
const getBestMove = (current: Coordinate, currentDir: Coordinate, target: Coordinate, layout: number[][], allowReverse: boolean, allowHouse: boolean): { nextPos: Coordinate, nextDir: Coordinate } => {
  let bestMove = current;
  let bestDir = currentDir;
  let minDistance = Infinity;
  const validMoves: { pos: Coordinate, dir: Coordinate, dist: number }[] = [];

  for (const dir of DIRECTIONS) {
    if (!allowReverse && dir.x === -currentDir.x && dir.z === -currentDir.z) continue;
    if (!allowHouse && isRedZone(current.x, current.z, dir)) continue;

    const nextX = current.x + dir.x;
    const nextZ = current.z + dir.z;

    if (!isWall(nextX, nextZ, layout, allowHouse)) {
      let checkX = nextX;
      if (nextZ === TUNNEL_ROW) {
          if (checkX < 0) checkX = layout[0].length - 1;
          else if (checkX >= layout[0].length) checkX = 0;
      }
      
      const dist = getDistSq({ x: checkX, z: nextZ }, target);
      validMoves.push({ pos: { x: nextX, z: nextZ }, dir, dist });
    }
  }

  if (validMoves.length === 0) {
      // Dead end handling (rare in standard maps but possible)
      for (const dir of DIRECTIONS) {
          const nextX = current.x + dir.x;
          const nextZ = current.z + dir.z;
          if (!isWall(nextX, nextZ, layout, allowHouse)) {
              return { nextPos: { x: nextX, z: nextZ }, nextDir: dir };
          }
      }
      return { nextPos: current, nextDir: currentDir };
  }

  for (const move of validMoves) {
      if (move.dist < minDistance) {
          minDistance = move.dist;
          bestMove = move.pos;
          bestDir = move.dir;
      }
  }
  return { nextPos: bestMove, nextDir: bestDir };
};

const getRandomMove = (current: Coordinate, currentDir: Coordinate, layout: number[][]) => {
    const validMoves: { pos: Coordinate, dir: Coordinate }[] = [];
    for (const dir of DIRECTIONS) {
        if (dir.x === -currentDir.x && dir.z === -currentDir.z) continue; 
        const nextX = current.x + dir.x;
        const nextZ = current.z + dir.z;
        if (!isWall(nextX, nextZ, layout, false)) {
            validMoves.push({ pos: { x: nextX, z: nextZ }, dir });
        }
    }
    if (validMoves.length > 0) {
        const randomIdx = Math.floor(Math.random() * validMoves.length);
        return { nextPos: validMoves[randomIdx].pos, nextDir: validMoves[randomIdx].dir };
    }
    return { nextPos: current, nextDir: currentDir };
};

// --- MAIN EXPORT ---
export const calculateGhostNextMove = (
  ghost: Ghost,
  allGhosts: Ghost[],
  playerPos: Coordinate,
  playerDir: Coordinate,
  layout: number[][],
  difficulty: Difficulty,
  globalMode: GlobalMode,
  isElroy: boolean,
  canLeaveHouse: boolean 
): { nextPos: Coordinate, nextDir: Coordinate } => {

  const currentPos = { x: Math.round(ghost.x), z: Math.round(ghost.z) };
  
  // EATEN STATE (Eyes returning home)
  if (ghost.state === GhostState.EATEN || ghost.state === GhostState.EYES) {
    const home = { x: ghost.startX, z: ghost.startZ }; 
    if (Math.abs(currentPos.x - home.x) <= 0.5 && Math.abs(currentPos.z - home.z) <= 0.5) {
       return { nextPos: currentPos, nextDir: { x: 0, z: 0 } };
    }
    return getNextStepBFS(currentPos, home, layout);
  }

  // HOUSE LOGIC
  if (isInGhostHouse(currentPos)) {
      if (canLeaveHouse) {
          return getBestMove(currentPos, ghost.currentDir, HOUSE_DOOR, layout, false, true);
      } else {
          // Bounce up and down waiting
          let nextDir = ghost.currentDir;
          if (nextDir.z === 0) nextDir = { x: 0, z: -1 };
          
          const targetZ = currentPos.z + (nextDir.z * 0.2); 
          
          if (targetZ < 8.6 || targetZ > 9.4) {
             nextDir = { x: 0, z: -nextDir.z };
             return { nextPos: currentPos, nextDir };
          }

          return { 
              nextPos: { x: currentPos.x, z: targetZ }, 
              nextDir 
          };
      }
  }

  //  SCARED OR FLASHING (Random Movement)
  if (ghost.state === GhostState.SCARED || ghost.state === GhostState.FLASHING) {
    return getRandomMove(currentPos, ghost.currentDir, layout);
  }

  //  CHASE / SCATTER
  let target = playerPos;
  
  if (globalMode === 'SCATTER' && !isElroy) {
     switch (ghost.color) {
        case GHOST_CONFIG.BLINKY.color: target = GHOST_CONFIG.BLINKY.scatterTarget; break;
        case GHOST_CONFIG.PINKY.color:  target = GHOST_CONFIG.PINKY.scatterTarget; break;
        case GHOST_CONFIG.INKY.color:   target = GHOST_CONFIG.INKY.scatterTarget; break;
        case GHOST_CONFIG.CLYDE.color:  target = GHOST_CONFIG.CLYDE.scatterTarget; break;
     }
  } else {
     // AI Smartness based on difficulty
     const isSmart = difficulty === 'HARD' || (difficulty === 'MEDIUM' && Math.random() > 0.2) || (difficulty === 'EASY' && Math.random() > 0.6);
     if (!isSmart) return getRandomMove(currentPos, ghost.currentDir, layout);

     switch (ghost.color) {
        case GHOST_CONFIG.BLINKY.color: target = getBlinkyTarget(playerPos); break;
        case GHOST_CONFIG.PINKY.color:  target = getPinkyTarget(playerPos, playerDir); break;
        case GHOST_CONFIG.INKY.color: {
          const blinky = allGhosts.find(g => g.color === GHOST_CONFIG.BLINKY.color);
          target = blinky ? getInkyTarget(playerPos, playerDir, blinky) : playerPos;
          break;
        }
        case GHOST_CONFIG.CLYDE.color:  target = getClydeTarget(currentPos, playerPos); break;
     }
  }

  return getBestMove(currentPos, ghost.currentDir, target, layout, false, false);
};