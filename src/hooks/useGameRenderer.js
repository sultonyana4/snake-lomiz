import { useEffect, useCallback } from 'react';
import { drawBackground, drawSnake, drawFood, drawClock, drawBomb } from '../lib/renderer.js';

export const useGameRenderer = (canvasRef, snake, direction, food, clock, bomb) => {
  // Render game on canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Draw all game elements
    drawBackground(ctx);
    drawSnake(ctx, snake, direction);
    drawFood(ctx, food);
    drawClock(ctx, clock);
    drawBomb(ctx, bomb);
  }, [canvasRef, snake, direction, food, clock, bomb]);

  // Render effect
  useEffect(() => {
    render();
  }, [render]);

  return { render };
};