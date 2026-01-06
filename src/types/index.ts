// კოორდინატები
export type Coordinate = {
  x: number;
  y: number; 
};

// მიმართულებები
export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

//  'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Direction = typeof Direction[keyof typeof Direction];

// უჯრის ტიპები
export const TileType = {
  EMPTY: 0,
  WALL: 1,
  FOOD: 2,
  PACMAN_START: 3,
  GHOST_START: 4,  
  GHOST_HOUSE: 5,  
} as const;

export type TileType = typeof TileType[keyof typeof TileType];

// მოჩვენების ინტერფეისი
export interface Ghost {
  id: string;
  position: Coordinate;
  direction: Direction;
  color: string;
}

// თამაშის მთლიანი სტეიტის ინტერფეისი
export interface GameState {
  pacman: Coordinate;
  pacmanDirection: Direction;
  ghosts: Ghost[];
  score: number;
  isGameOver: boolean;
  layout: number[][]; 
}