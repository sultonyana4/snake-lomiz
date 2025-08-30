// Game configuration constants
export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
export const INITIAL_TIMER = 30;
export const GAME_SPEED = 200;

export const GAME_STATES = {
  START_SCREEN: 'START_SCREEN',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
};

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const ITEM_TIMERS = {
  CLOCK_DURATION: 10000, // 10 seconds
  BOMB_DURATION: 7000,   // 7 seconds
  TIMER_INTERVAL: 100    // 100ms intervals
};

export const SPAWN_RATES = {
  CLOCK: 0.1,  // 10% chance per game tick
  BOMB: 0.15   // 15% chance per game tick
};

export const SCORING = {
  FOOD_POINTS: 10,
  TIME_BONUS: 5
};