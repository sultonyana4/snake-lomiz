'use client';

import { useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState.js';
import { useGameLoop } from '../hooks/useGameLoop.js';
import { useKeyboardControls } from '../hooks/useKeyboardControls.js';
import { useGameRenderer } from '../hooks/useGameRenderer.js';
import { useMonadGames } from '../hooks/useMonadGames.js';
import { GameCanvas } from '../components/GameCanvas.js';
import { LoginScreen } from '../components/LoginScreen.js';
import { StartScreen, GameOverScreen } from '../components/GameScreens.js';
import { Leaderboard } from '../components/Leaderboard.js';
import { BlockchainStatus } from '../components/BlockchainStatus.js';
import { GAME_STATES } from '../lib/constants.js';

export default function SnakeLomiz() {
  const canvasRef = useRef(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Monad Games integration
  const { isAuthenticated, updateScore } = useMonadGames();

  // Game state management with score callback
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

  // Game loop
  useGameLoop(gameState, gameStateActions, processDirectionQueue);

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

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white relative">
      <h1 className="text-4xl font-bold mb-6 text-center">🐍 Snake Lomiz</h1>

      {/* Start Screen */}
      <StartScreen 
        gameState={gameState} 
        onStartGame={handleStartGame}
        onShowLeaderboard={handleShowLeaderboard}
      />

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
      <GameOverScreen 
        gameState={gameState}
        score={score}
        onPlayAgain={handlePlayAgain}
        onShowLeaderboard={handleShowLeaderboard}
        onBackToMenu={handleBackToMenu}
        scoreStatus={scoreStatus}
        scoreError={scoreError}
      />

      {/* Leaderboard Modal */}
      <Leaderboard 
        isVisible={showLeaderboard}
        onClose={handleCloseLeaderboard}
      />

      <div className="text-center text-sm text-gray-400">
        <p>✅ Snake Game with Monad Games ID Integration</p>
        <p>✅ Automatic Blockchain Score Sync</p>
        <p>🎮 Use Arrow Keys to Play</p>
      </div>

      {/* Blockchain Status */}
      <BlockchainStatus />
    </div>
  );
}