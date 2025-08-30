import { useEffect, useCallback, useRef } from 'react';
import { GAME_STATES, DIRECTIONS } from '../lib/constants.js';
import { isValidDirectionChange } from '../lib/gameLogic.js';

export const useKeyboardControls = (gameState, direction, setDirection) => {
  const directionQueueRef = useRef([]);
  const gameStateRef = useRef({ gameState, direction, setDirection });

  // Update refs
  useEffect(() => {
    gameStateRef.current = { gameState, direction, setDirection };
  }, [gameState, direction, setDirection]);

  // Handle keyboard input with direction queue
  const handleKeyPress = useCallback((event) => {
    const { gameState: currentGameState, direction: currentDirection } = gameStateRef.current;
    
    if (currentGameState !== GAME_STATES.PLAYING) return;

    const { key } = event;
    const keyToDirection = {
      ArrowUp: DIRECTIONS.UP,
      ArrowDown: DIRECTIONS.DOWN,
      ArrowLeft: DIRECTIONS.LEFT,
      ArrowRight: DIRECTIONS.RIGHT
    };

    const newDirection = keyToDirection[key];

    if (newDirection) {
      // Prevent default arrow key behavior (scrolling)
      event.preventDefault();

      // Get the current effective direction (either current direction or last queued direction)
      const currentEffectiveDirection = directionQueueRef.current.length > 0
        ? directionQueueRef.current[directionQueueRef.current.length - 1]
        : currentDirection;

      // Only add to queue if it's a valid direction change and not already the same direction
      if (isValidDirectionChange(currentEffectiveDirection, newDirection) &&
        !(currentEffectiveDirection.x === newDirection.x && currentEffectiveDirection.y === newDirection.y)) {

        // Clear queue and add new direction (only keep the most recent input)
        directionQueueRef.current = [newDirection];
      }
    }
  }, []);

  // Process direction queue - this should be called from the game loop
  const processDirectionQueue = useCallback(() => {
    const { direction: currentDirection, setDirection: currentSetDirection } = gameStateRef.current;
    
    if (directionQueueRef.current.length > 0) {
      const nextDirection = directionQueueRef.current.shift();
      if (isValidDirectionChange(currentDirection, nextDirection)) {
        currentSetDirection(nextDirection);
      }
    }
  }, []);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { processDirectionQueue };
};