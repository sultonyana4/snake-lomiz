import { CANVAS_SIZE } from '../lib/constants.js';

export const GameCanvas = ({ canvasRef }) => {
  return (
    <div id="game-area" className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-gray-600 bg-gray-800"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="text-xs text-gray-500 absolute top-1 left-1">
          Swipe to move
        </div>
      </div>
    </div>
  );
};