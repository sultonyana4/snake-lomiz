import { useState, useCallback } from 'react';
import { GAME_STATES, INITIAL_TIMER, DIRECTIONS } from '../lib/constants.js';
import { getInitialGameState } from '../lib/gameLogic.js';

export const useGameState = (updateScoreCallback) => {
  const [gameState, setGameState] = useState(GAME_STATES.START_SCREEN);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIMER);
  const [scoreStatus, setScoreStatus] = useState(null); // 'saving', 'success', 'error'
  const [scoreError, setScoreError] = useState(null);
  
  // Game objects state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [clock, setClock] = useState(null);
  const [bomb, setBomb] = useState(null);
  const [clockTimer, setClockTimer] = useState(0);
  const [bombTimer, setBombTimer] = useState(0);

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialState = getInitialGameState();
    
    setSnake(initialState.snake);
    setDirection(initialState.direction);
    setScore(0);
    setTimeRemaining(INITIAL_TIMER);
    setFood(initialState.food);
    setClock(initialState.clock);
    setBomb(initialState.bomb);
    setClockTimer(initialState.clockTimer);
    setBombTimer(initialState.bombTimer);
  }, []);

  // Start game
  const startGame = useCallback(() => {
    initializeGame();
    setGameState(GAME_STATES.PLAYING);
  }, [initializeGame]);

  // Game over
  const gameOver = useCallback(async () => {
    setGameState(GAME_STATES.GAME_OVER);
    
    // Save score to Monad Games if callback provided
    if (updateScoreCallback && score > 0) {
      setScoreStatus('saving');
      setScoreError(null);
      
      try {
        const result = await updateScoreCallback({
          score,
          timeRemaining,
          level: 1,
        });
        console.log('Score saved successfully:', result);
        setScoreStatus('success');
      } catch (error) {
        console.error('Failed to save score:', error);
        setScoreStatus('error');
        setScoreError(error.message || 'Unknown error occurred');
      }
    }
  }, [score, timeRemaining, updateScoreCallback]);

  return {
    // State
    gameState,
    score,
    timeRemaining,
    scoreStatus,
    scoreError,
    snake,
    direction,
    food,
    clock,
    bomb,
    clockTimer,
    bombTimer,
    
    // Actions
    setGameState,
    setScore,
    setTimeRemaining,
    setSnake,
    setDirection,
    setFood,
    setClock,
    setBomb,
    setClockTimer,
    setBombTimer,
    startGame,
    gameOver,
    initializeGame
  };
};