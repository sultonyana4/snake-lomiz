export const GameInstructions = () => {
  return (
    <div className="mt-6 text-center text-gray-300 max-w-2xl">
      <h3 className="text-lg font-semibold mb-2">How to Play</h3>
      <div className="text-sm space-y-1">
        <p><strong>Controls:</strong> Use arrow keys to move the snake</p>
        <p><strong>Food (Golden Circle):</strong> +10 points, grows snake</p>
        <p><strong>Clock (Blue Square):</strong> +5 seconds, disappears after 10s</p>
        <p><strong>Bomb (Dark Circle):</strong> Game over if touched, disappears after 7s</p>
        <p><strong>Avoid:</strong> Walls, your own body, and bombs!</p>
      </div>
    </div>
  );
};