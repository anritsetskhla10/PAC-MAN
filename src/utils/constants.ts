export const CELL_SIZE = 20; 

export const GHOST_SPEEDS = {
  NORMAL: 0.20,       
  SCARED: 0.10,       
  EATEN: 0.60,        
  TUNNEL: 0.10,       
  ELROY_1: 0.21,      
  ELROY_2: 0.22       
};

export const WAVE_TIMINGS = [
  { mode: 'SCATTER', duration: 7 },
  { mode: 'CHASE', duration: 20 },
  { mode: 'SCATTER', duration: 7 },
  { mode: 'CHASE', duration: 20 },
  { mode: 'SCATTER', duration: 5 },
  { mode: 'CHASE', duration: 20 },
  { mode: 'SCATTER', duration: 5 },
  { mode: 'CHASE', duration: -1 } 
] as const;

export const TUNNEL_ROW = 7; 
export const HOUSE_DOOR = { x: 9, z: 8 };


export const LEVEL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
  [1, 6, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 6, 1], 
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], 
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], 
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 2, 1],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], 
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 1, 1, 0, 1, 2, 1, 1, 1, 1], 
  [1, 2, 2, 2, 2, 2, 2, 1, 4, 4, 4, 1, 2, 2, 2, 2, 2, 2, 1], 
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1], 
  [1, 7, 2, 1, 6, 2, 2, 2, 2, 3, 2, 2, 2, 2, 6, 1, 2, 8, 1], 
  [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1], 
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const SCORES = {
  DOT: 10,
  POWER_PELLET: 50,
  CHERRY: 100,
  STRAWBERRY: 300,
};

export const GHOST_CONFIG = {
  BLINKY: { color: 'red', scatterTarget: { x: 17, z: 1 } },
  PINKY:  { color: '#FFB8FF', scatterTarget: { x: 1, z: 1 } },
  INKY:   { color: '#00FFFF', scatterTarget: { x: 17, z: 13 } },
  CLYDE:  { color: '#FFB852', scatterTarget: { x: 1, z: 13 } }
};