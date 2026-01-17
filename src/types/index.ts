export type Coordinate = {
  x: number;
  z: number; 
};

// მიმართულებები
export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;
export type Direction = typeof Direction[keyof typeof Direction];

// უჯრის ტიპები
export const TileType = {
  EMPTY: 0,
  WALL: 1,
  FOOD: 2,
  PACMAN_START: 3,
  GHOST_START: 4,  
  GHOST_HOUSE: 5,  
  POWER_PELLET: 6,
  CHERRY: 7,
  STRAWBERRY: 8,
} as const;
export type TileType = typeof TileType[keyof typeof TileType];

// --- GHOST STATE  ---
export const GhostState = {
  NORMAL: 'NORMAL',   
  SCARED: 'SCARED',   
  EATEN: 'EATEN',     
} as const;
export type GhostState = typeof GhostState[keyof typeof GhostState];

// მოჩვენების ინტერფეისი 
export interface Ghost {
  id?: string;
  x: number;
  z: number;
  startX: number; 
  startZ: number;
  color: string;
  state: GhostState; 
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'won';