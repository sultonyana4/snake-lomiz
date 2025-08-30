import { CANVAS_SIZE } from '../lib/constants.js';

export const GameCanvas = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="border-2 border-gray-600 bg-gray-800"
    />
  );
};