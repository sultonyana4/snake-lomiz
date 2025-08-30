'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { usePlayerData } from '../hooks/usePlayerData.js';
import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';

export const WalletInfo = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { totalScore, gameScore, isLoading } = usePlayerData();
  const { isMonadGamesUser } = useMonadGamesAuth();

  if (!isConnected || !address) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      <div className="bg-gray-800 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          {isMonadGamesUser && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs text-purple-400">Monad Games ID</span>
            </div>
          )}
          {!isMonadGamesUser && (
            <span className="text-xs text-gray-400">Connected</span>
          )}
        </div>
        <div className="text-sm text-white font-mono">{shortAddress}</div>

        {/* Player Stats */}
        <div className="text-xs text-gray-400 mt-1">
          {isLoading ? (
            <span>Loading stats...</span>
          ) : (
            <div className="flex gap-2">
              <span>Game: {gameScore}</span>
              <span>Total: {totalScore}</span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => disconnect()}
        className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};