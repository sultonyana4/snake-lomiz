'use client';

import { useRef, useState } from 'react';
import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';
import { useGameState } from '../hooks/useGameState.js';
import { useGameLoop } from '../hooks/useGameLoop.js';
import { useKeyboardControls } from '../hooks/useKeyboardControls.js';
import { useMobileControls } from '../hooks/useMobileControls.js';
import { useSwipeControls } from '../hooks/useSwipeControls.js';
import { useGameRenderer } from '../hooks/useGameRenderer.js';
import { GameCanvas } from '../components/GameCanvas.js';
import { MobileControls } from '../components/MobileControls.js';
import { UserHeader } from '../components/UserHeader.js';
import { LoginScreen } from '../components/LoginScreen.js';
import { GAME_STATES } from '../lib/constants.js';

export default function SnakeLomiz() {
  const canvasRef = useRef(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { authenticated, user, getWalletAddress } = useMonadGamesAuth();

  // Simple score update function
  const updateScore = async (gameData) => {
    const walletAddress = getWalletAddress();
    if (!authenticated || !walletAddress) {
      console.log('No wallet connected, skipping score save');
      return { success: false };
    }

    try {
      console.log('Saving score to blockchain:', gameData.score);

      const response = await fetch('/api/blockchain/update-player-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: walletAddress,
          scoreAmount: gameData.score,
          transactionAmount: 1
        }),
      });

      if (response.ok) {
        console.log('Score saved successfully!');
        return { success: true };
      } else {
        console.error('Failed to save score');
        return { success: false };
      }
    } catch (error) {
      console.error('Error saving score:', error);
      return { success: false };
    }
  };

  // Game state management
  const gameStateActions = useGameState(updateScore);
  const {
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
    startGame,
    setGameState
  } = gameStateActions;

  // Keyboard controls
  const { processDirectionQueue } = useKeyboardControls(gameState, direction, gameStateActions.setDirection);

  // Mobile controls
  const { handleMobileDirectionChange, processMobileDirectionQueue } = useMobileControls(gameState, direction, gameStateActions.setDirection);

  // Swipe controls
  const { processSwipeDirectionQueue } = useSwipeControls(gameState, direction, gameStateActions.setDirection);

  // Combined direction processing for game loop
  const processAllDirectionQueues = () => {
    processDirectionQueue();
    processMobileDirectionQueue();
    processSwipeDirectionQueue();
  };

  // Game loop
  useGameLoop(gameState, gameStateActions, processAllDirectionQueues);

  // Renderer
  useGameRenderer(canvasRef, snake, direction, food, clock, bomb);

  const handleStartGame = () => {
    startGame();
  };

  const handleBackToMenu = () => {
    setGameState(GAME_STATES.START_SCREEN);
  };

  const handlePlayAgain = () => {
    startGame();
  };

  // Show login screen if not authenticated
  if (!authenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 pb-32 md:pb-4 text-white relative">
      {/* User Header with Logout */}
      <UserHeader />

      <h1 className="text-4xl font-bold mb-6 text-center">🐍 Snake Lomiz</h1>

      {/* Start Screen */}
      {gameState === GAME_STATES.START_SCREEN && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 text-center">
          <p className="text-gray-300 mb-4">
            Classic Snake Game with Blockchain Integration
          </p>

          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mb-4 block w-full"
          >
            🎮 Start Game
          </button>

          <div className="text-sm text-gray-400">
            <p>Use arrow keys or touch controls to move</p>
            <p>🟡 Eat food to grow and increase score</p>
            <p>🕐 Collect clocks for extra time (+5s)</p>
            <p>💣 Avoid bombs - they will kill you!</p>
            <p>⏰ Game ends when timer reaches 0</p>
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === GAME_STATES.PLAYING && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="text-yellow-400 font-semibold">Score: {score}</div>
            <div className={`font-semibold ${timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              Time: {timeRemaining}s
            </div>
          </div>

          <GameCanvas canvasRef={canvasRef} />

          <div className="mt-4 text-center">
            <div className="text-xs text-gray-400 mb-2">
              🟡 Food (+10 pts) • 🕐 Clock (+5s) • 💣 Bomb (death)
            </div>
            <div className="text-xs text-gray-400 mb-2">
              🎮 Desktop: Arrow keys • Mobile: Touch buttons or swipe
            </div>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === GAME_STATES.GAME_OVER && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Game Over!</h2>

          <div className="mb-4">
            <p className="text-yellow-400 text-lg">Final Score: {score}</p>
            <p className="text-gray-300">Snake Length: {snake.length}</p>
            <p className="text-gray-300">Time Survived: {30 - timeRemaining}s</p>
          </div>

          {/* Score submission status */}
          <div className="mb-6 text-center">
            {scoreStatus === 'saving' && (
              <p className="text-yellow-400 text-sm">💾 Saving score to blockchain...</p>
            )}
            {scoreStatus === 'success' && (
              <div className="text-green-400 text-sm">
                <p>✅ Score saved to Monad Games!</p>
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
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700 transition-colors block w-full"
            >
              🎮 Play Again
            </button>

            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transition-colors block w-full"
            >
              📋 Main Menu
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        <p>✅ Snake Game with Monad Games ID Integration</p>
        <p>✅ Automatic Blockchain Score Sync</p>
        <p>🎮 Use Arrow Keys or Touch Controls to Play</p>
      </div>

      {/* Mobile Controls */}
      <MobileControls 
        onDirectionChange={handleMobileDirectionChange}
        gameState={gameState}
      />
    </div>
  );
}