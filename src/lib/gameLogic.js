import { GRID_SIZE, DIRECTIONS } from './constants.js';

// Generate random empty position
export const getRandomEmptyPosition = (occupiedPositions = []) => {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (occupiedPositions.some(pos => pos.x === position.x && pos.y === position.y));
  return position;
};

// Check collision with walls or self
export const checkCollisions = (head, snakeBody) => {
  // Wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }
  
  // Self collision
  return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
};

// Get next snake head position
export const getNextHeadPosition = (currentHead, direction) => {
  return {
    x: currentHead.x + direction.x,
    y: currentHead.y + direction.y
  };
};

// Check if direction change is valid (no instant reverse)
export const isValidDirectionChange = (currentDirection, newDirection) => {
  // Check if trying to reverse direction
  const isOpposite = (
    (currentDirection.x === -newDirection.x && currentDirection.y === -newDirection.y) &&
    (currentDirection.x !== 0 || currentDirection.y !== 0)
  );
  
  return !isOpposite;
};

// Check collision between two positions
export const checkPositionCollision = (pos1, pos2) => {
  return pos1 && pos2 && pos1.x === pos2.x && pos1.y === pos2.y;
};

// Get initial game state
export const getInitialGameState = () => {
  const initialSnake = [{ x: 10, y: 10 }];
  return {
    snake: initialSnake,
    direction: DIRECTIONS.RIGHT,
    food: getRandomEmptyPosition(initialSnake),
    clock: null,
    bomb: null,
    clockTimer: 0,
    bombTimer: 0
  };
};