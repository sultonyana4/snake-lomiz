import { CELL_SIZE, CANVAS_SIZE, GRID_SIZE, DIRECTIONS } from './constants.js';

// Clear canvas and draw background grid
export const drawBackground = (ctx) => {
  // Clear canvas with subtle grid pattern
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  
  // Draw subtle grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
    ctx.stroke();
  }
};

// Draw snake head with eyes
const drawSnakeHead = (ctx, segment, direction) => {
  const x = segment.x * CELL_SIZE;
  const y = segment.y * CELL_SIZE;
  const centerX = x + CELL_SIZE / 2;
  const centerY = y + CELL_SIZE / 2;
  const radius = CELL_SIZE / 2 - 2;
  
  // Snake head with gradient
  const headGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  headGradient.addColorStop(0, '#10b981');
  headGradient.addColorStop(1, '#059669');
  
  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add border to head
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw eyes based on direction
  ctx.fillStyle = '#ffffff';
  let eye1X, eye1Y, eye2X, eye2Y;
  
  if (direction === DIRECTIONS.RIGHT) {
    eye1X = centerX + 3; eye1Y = centerY - 4;
    eye2X = centerX + 3; eye2Y = centerY + 4;
  } else if (direction === DIRECTIONS.LEFT) {
    eye1X = centerX - 3; eye1Y = centerY - 4;
    eye2X = centerX - 3; eye2Y = centerY + 4;
  } else if (direction === DIRECTIONS.UP) {
    eye1X = centerX - 4; eye1Y = centerY - 3;
    eye2X = centerX + 4; eye2Y = centerY - 3;
  } else {
    eye1X = centerX - 4; eye1Y = centerY + 3;
    eye2X = centerX + 4; eye2Y = centerY + 3;
  }
  
  // White part of eyes
  ctx.beginPath();
  ctx.arc(eye1X, eye1Y, 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2X, eye2Y, 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Black pupils
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(eye1X, eye1Y, 1, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2X, eye2Y, 1, 0, 2 * Math.PI);
  ctx.fill();
};

// Draw snake body segment
const drawSnakeBody = (ctx, segment, index) => {
  const x = segment.x * CELL_SIZE;
  const y = segment.y * CELL_SIZE;
  const centerX = x + CELL_SIZE / 2;
  const centerY = y + CELL_SIZE / 2;
  const radius = CELL_SIZE / 2 - 2;
  
  // Snake body with gradient
  const bodyGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  const alpha = Math.max(0.6, 1 - (index * 0.05)); // Fade towards tail
  bodyGradient.addColorStop(0, `rgba(34, 197, 94, ${alpha})`);
  bodyGradient.addColorStop(1, `rgba(21, 128, 61, ${alpha})`);
  
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add subtle border
  ctx.strokeStyle = `rgba(5, 150, 105, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Add scale pattern for body segments
  if (index % 2 === 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 4, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// Draw the entire snake
export const drawSnake = (ctx, snake, direction) => {
  snake.forEach((segment, index) => {
    if (index === 0) {
      drawSnakeHead(ctx, segment, direction);
    } else {
      drawSnakeBody(ctx, segment, index);
    }
  });
};

// Draw food with pulsing effect
export const drawFood = (ctx, food) => {
  const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
  const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
  const foodRadius = CELL_SIZE / 2 - 2;
  const pulseEffect = Math.sin(Date.now() * 0.005) * 2 + foodRadius;
  
  const foodGradient = ctx.createRadialGradient(foodX, foodY, 0, foodX, foodY, pulseEffect);
  foodGradient.addColorStop(0, '#fbbf24');
  foodGradient.addColorStop(0.7, '#f59e0b');
  foodGradient.addColorStop(1, '#d97706');
  
  ctx.fillStyle = foodGradient;
  ctx.beginPath();
  ctx.arc(foodX, foodY, pulseEffect, 0, 2 * Math.PI);
  ctx.fill();
  
  // Food highlight
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(foodX - 3, foodY - 3, 3, 0, 2 * Math.PI);
  ctx.fill();
};

// Draw clock with animated effect
export const drawClock = (ctx, clock) => {
  if (!clock) return;
  
  const clockX = clock.x * CELL_SIZE;
  const clockY = clock.y * CELL_SIZE;
  const clockCenterX = clockX + CELL_SIZE / 2;
  const clockCenterY = clockY + CELL_SIZE / 2;
  
  // Rotating glow effect
  const rotation = Date.now() * 0.003;
  ctx.save();
  ctx.translate(clockCenterX, clockCenterY);
  ctx.rotate(rotation);
  
  // Outer glow
  const clockGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, CELL_SIZE / 2);
  clockGradient.addColorStop(0, '#60a5fa');
  clockGradient.addColorStop(0.7, '#3b82f6');
  clockGradient.addColorStop(1, '#1d4ed8');
  
  ctx.fillStyle = clockGradient;
  ctx.fillRect(-CELL_SIZE / 2 + 2, -CELL_SIZE / 2 + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  
  // Clock face
  ctx.fillStyle = '#dbeafe';
  ctx.fillRect(-CELL_SIZE / 2 + 4, -CELL_SIZE / 2 + 4, CELL_SIZE - 8, CELL_SIZE - 8);
  
  // Clock hands
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(3, 0);
  ctx.stroke();
  
  ctx.restore();
};

// Draw bomb with danger effect
export const drawBomb = (ctx, bomb) => {
  if (!bomb) return;
  
  const bombX = bomb.x * CELL_SIZE + CELL_SIZE / 2;
  const bombY = bomb.y * CELL_SIZE + CELL_SIZE / 2;
  const bombRadius = CELL_SIZE / 2 - 2;
  
  // Danger pulse
  const dangerPulse = Math.sin(Date.now() * 0.01) * 0.5 + 1;
  
  // Outer danger glow
  const dangerGradient = ctx.createRadialGradient(bombX, bombY, 0, bombX, bombY, bombRadius + 5);
  dangerGradient.addColorStop(0, `rgba(239, 68, 68, ${dangerPulse * 0.3})`);
  dangerGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
  
  ctx.fillStyle = dangerGradient;
  ctx.beginPath();
  ctx.arc(bombX, bombY, bombRadius + 5, 0, 2 * Math.PI);
  ctx.fill();
  
  // Bomb body
  const bombGradient = ctx.createRadialGradient(bombX, bombY, 0, bombX, bombY, bombRadius);
  bombGradient.addColorStop(0, '#4b5563');
  bombGradient.addColorStop(0.7, '#374151');
  bombGradient.addColorStop(1, '#1f2937');
  
  ctx.fillStyle = bombGradient;
  ctx.beginPath();
  ctx.arc(bombX, bombY, bombRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Bomb fuse
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bombX - 2, bombY - bombRadius);
  ctx.lineTo(bombX - 4, bombY - bombRadius - 4);
  ctx.stroke();
  
  // Spark effect on fuse
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(bombX - 4, bombY - bombRadius - 4, 1, 0, 2 * Math.PI);
  ctx.fill();
};