import { useCallback, useRef, useEffect } from 'react';
import { GAME_STATES } from '../lib/constants.js';
import { isValidDirectionChange } from '../lib/gameLogic.js';

export const useMobileControls = (gameState, direction, setDirection) => {
  const directionQueueRef = useRef([]);
  const gameStateRef = useRef({ gameState, direction, setDirection });

  // Update refs
  useEffect(() => {
    gameStateRef.current = { gameState, direction, setDirection };
  }, [gameState, direction, setDirection]);

  // Handle mobile direction input
  const handleMobileDirectionChange = useCallback((newDirection) => {
    const { gameState: currentGameState, direction: currentDirection } = gameStateRef.current;
    
    if (currentGameState !== GAME_STATES.PLAYING) return;

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
  }, []);

  // Process direction queue - this should be called from the game loop
  const processMobileDirectionQueue = useCallback(() => {
    const { direction: currentDirection, setDirection: currentSetDirection } = gameStateRef.current;
    
    if (directionQueueRef.current.length > 0) {
      const nextDirection = directionQueueRef.current.shift();
      if (isValidDirectionChange(currentDirection, nextDirection)) {
        currentSetDirection(nextDirection);
      }
    }
  }, []);

  return { 
    handleMobileDirectionChange, 
    processMobileDirectionQueue 
  };
};