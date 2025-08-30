import { GAME_STATES } from '../lib/constants.js';
import { Logo } from './Logo.js';
import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';

export const StartScreen = ({ gameState, onStartGame, onShowLeaderboard }) => {
  if (gameState !== GAME_STATES.START_SCREEN) return null;
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
      <div className="flex items-center gap-4 mb-6">
        <Logo size={64} />
        <h2 className="text-3xl font-bold text-white">Snake Lomiz</h2>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={onStartGame}
          className="px-6 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors block w-full"
        >
          🎮 Start Game
        </button>
        
        <button
          onClick={onShowLeaderboard}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors block w-full"
        >
          🏆 Leaderboard
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-400 text-center max-w-md">
        <p className="mb-2">🟡 Eat food to grow and increase score</p>
        <p className="mb-2">🕐 Collect clocks for extra time (+5s)</p>
        <p className="mb-2">💣 Avoid bombs - they will kill you!</p>
        <p>⏰ Game ends when timer reaches 0</p>
      </div>
    </div>
  );
};

export const GameOverScreen = ({ gameState, score, onPlayAgain, onShowLeaderboard, onBackToMenu, scoreStatus, scoreError }) => {
  const { user, getWalletAddress, isMonadGamesUser } = useMonadGamesAuth();
  const walletAddress = getWalletAddress();
  
  if (gameState !== GAME_STATES.GAME_OVER) return null;
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
      <p className="text-xl text-white mb-2">Final Score: {score}</p>
      {walletAddress && (
        <div className="text-sm text-gray-300 mb-4 text-center">
          <p>Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          {isMonadGamesUser && (
            <p className="text-purple-400 text-xs">✨ Monad Games ID User</p>
          )}
        </div>
      )}
      
      {/* Score submission status */}
      <div className="mb-6 text-center">
        {scoreStatus === 'saving' && (
          <p className="text-yellow-400 text-sm">💾 Saving score to blockchain...</p>
        )}
        {scoreStatus === 'success' && (
          <div className="text-green-400 text-sm">
            <p>✅ Score saved to Monad Games ID!</p>
            <p className="text-xs mt-1">Your score is now on the leaderboard</p>
          </div>
        )}
        {scoreStatus === 'error' && (
          <div className="text-red-400 text-sm">
            <p>❌ Failed to save score</p>
            {scoreError && <p className="text-xs mt-1">{scoreError}</p>}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors block w-full"
        >
          🎮 Play Again
        </button>
        
        <button
          onClick={onShowLeaderboard}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors block w-full"
        >
          🏆 View Leaderboard
        </button>
        
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transition-colors block w-full"
        >
          📋 Main Menu
        </button>
      </div>
    </div>
  );
};