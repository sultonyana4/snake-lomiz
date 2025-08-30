import { useEffect, useCallback, useRef } from 'react';
import { GAME_STATES, DIRECTIONS } from '../lib/constants.js';
import { isValidDirectionChange } from '../lib/gameLogic.js';

export const useSwipeControls = (gameState, direction, setDirection) => {
  const touchStartRef = useRef({ x: 0, y: 0 });
  const directionQueueRef = useRef([]);
  const gameStateRef = useRef({ gameState, direction, setDirection });

  // Update refs
  useEffect(() => {
    gameStateRef.current = { gameState, direction, setDirection };
  }, [gameState, direction, setDirection]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const { gameState: currentGameState, direction: currentDirection } = gameStateRef.current;
    
    if (currentGameState !== GAME_STATES.PLAYING) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Minimum swipe distance
    const minSwipeDistance = 30;
    
    // Determine if this is a valid swipe
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return; // Not a swipe, too short
    }

    let newDirection;
    
    // Determine direction based on the larger delta
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      newDirection = deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    } else {
      // Vertical swipe
      newDirection = deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    }

    // Get the current effective direction
    const currentEffectiveDirection = directionQueueRef.current.length > 0
      ? directionQueueRef.current[directionQueueRef.current.length - 1]
      : currentDirection;

    // Only add to queue if it's a valid direction change
    if (isValidDirectionChange(currentEffectiveDirection, newDirection) &&
      !(currentEffectiveDirection.x === newDirection.x && currentEffectiveDirection.y === newDirection.y)) {
      
      // Clear queue and add new direction
      directionQueueRef.current = [newDirection];
    }
  }, []);

  // Process direction queue
  const processSwipeDirectionQueue = useCallback(() => {
    const { direction: currentDirection, setDirection: currentSetDirection } = gameStateRef.current;
    
    if (directionQueueRef.current.length > 0) {
      const nextDirection = directionQueueRef.current.shift();
      if (isValidDirectionChange(currentDirection, nextDirection)) {
        currentSetDirection(nextDirection);
      }
    }
  }, []);

  // Add touch event listeners
  useEffect(() => {
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.addEventListener('touchstart', handleTouchStart, { passive: true });
      gameArea.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        gameArea.removeEventListener('touchstart', handleTouchStart);
        gameArea.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchEnd]);

  return { processSwipeDirectionQueue };
};