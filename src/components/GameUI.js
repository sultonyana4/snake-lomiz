import { GAME_STATES } from '../lib/constants.js';

export const GameUI = ({ gameState, score, timeRemaining }) => {
  if (gameState !== GAME_STATES.PLAYING) return null;
  
  return (
    <div className="absolute top-2 left-2 text-white">
      <div className="text-xl font-semibold">Score: {score}</div>
      <div className="text-xl font-semibold">Time: {timeRemaining}s</div>
    </div>
  );
};