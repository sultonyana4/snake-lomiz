import { useEffect, useRef } from 'react';
import {
  GAME_STATES,
  GAME_SPEED,
  SPAWN_RATES,
  ITEM_TIMERS,
  SCORING
} from '../lib/constants.js';
import {
  checkCollisions,
  getNextHeadPosition,
  checkPositionCollision,
  getRandomEmptyPosition
} from '../lib/gameLogic.js';

export const useGameLoop = (gameState, gameStateActions, processDirectionQueue) => {
  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);
  const gameStateRef = useRef(gameStateActions);

  // Update refs with current values
  useEffect(() => {
    gameStateRef.current = gameStateActions;
  }, [gameStateActions]);

  // Game loop effect
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const gameLoop = setInterval(() => {
        const {
          snake,
          direction,
          food,
          clock,
          bomb,
          setSnake,
          setScore,
          setTimeRemaining,
          setFood,
          setClock,
          setBomb,
          setClockTimer,
          setBombTimer,
          gameOver
        } = gameStateRef.current;

        // Process any queued direction changes first
        if (processDirectionQueue) {
          processDirectionQueue();
        }

        // Move snake
        setSnake(currentSnake => {
          const head = currentSnake[0];
          const newHead = getNextHeadPosition(head, direction);

          // Check collisions
          if (checkCollisions(newHead, currentSnake)) {
            gameOver();
            return currentSnake;
          }

          // Check bomb collision
          if (checkPositionCollision(newHead, bomb)) {
            gameOver();
            return currentSnake;
          }

          let newSnake = [newHead, ...currentSnake];
          let shouldGrow = false;

          // Check food collision
          if (checkPositionCollision(newHead, food)) {
            setScore(prev => prev + SCORING.FOOD_POINTS);
            shouldGrow = true;

            // Generate new food
            const occupiedPositions = [...newSnake];
            if (clock) occupiedPositions.push(clock);
            if (bomb) occupiedPositions.push(bomb);
            setFood(getRandomEmptyPosition(occupiedPositions));
          }

          // Check clock collision
          if (checkPositionCollision(newHead, clock)) {
            setTimeRemaining(prev => prev + SCORING.TIME_BONUS);
            setClock(null);
            setClockTimer(0);
          }

          // Remove tail if not growing
          if (!shouldGrow) {
            newSnake.pop();
          }

          return newSnake;
        });

        // Spawn special items randomly
        const occupiedPositions = [...snake, food];

        // Spawn clock (less frequent)
        if (!clock && Math.random() < SPAWN_RATES.CLOCK) {
          setClock(getRandomEmptyPosition(occupiedPositions));
          setClockTimer(ITEM_TIMERS.CLOCK_DURATION);
        }

        // Spawn bomb
        if (!bomb && Math.random() < SPAWN_RATES.BOMB) {
          const bombPositions = [...occupiedPositions];
          if (clock) bombPositions.push(clock);
          setBomb(getRandomEmptyPosition(bombPositions));
          setBombTimer(ITEM_TIMERS.BOMB_DURATION);
        }
      }, GAME_SPEED);

      gameLoopRef.current = gameLoop;

      return () => {
        clearInterval(gameLoop);
      };
    } else {
      // Clear interval when not playing
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [gameState, processDirectionQueue]); // Minimal dependencies

  // Timer effect
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const timer = setInterval(() => {
        const { setTimeRemaining, gameOver } = gameStateRef.current;

        setTimeRemaining(prev => {
          if (prev <= 1) {
            gameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = timer;

      return () => {
        clearInterval(timer);
      };
    } else {
      // Clear timer when not playing
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
};