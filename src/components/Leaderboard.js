'use client';

import { useState, useEffect } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard.js';

export const Leaderboard = ({ isVisible, onClose }) => {
  const { 
    leaderboard: leaderboardData, 
    isLoading: loading, 
    error, 
    refetch: fetchLeaderboard,
    lastUpdated 
  } = useLeaderboard(10, false);

  // Fetch when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchLeaderboard();
    }
  }, [isVisible, fetchLeaderboard]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-300 py-4">
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-4">
            Error: {typeof error === 'string' ? error : 'Failed to load leaderboard'}
          </div>
        )}

        {!loading && !error && leaderboardData.length === 0 && (
          <div className="text-center text-gray-300 py-4">
            No scores yet. Be the first to play!
          </div>
        )}

        {!loading && !error && leaderboardData.length > 0 && (
          <div className="space-y-2">
            {leaderboardData.map((player, index) => (
              <div
                key={player.address || index}
                className={`flex justify-between items-center p-3 rounded ${
                  index === 0 ? 'bg-yellow-600' : 
                  index === 1 ? 'bg-gray-600' : 
                  index === 2 ? 'bg-orange-600' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">#{player.rank || index + 1}</span>
                  <div>
                    <div className="text-white font-semibold">
                      {player.username || `Player_${player.address?.slice(-6)}`}
                    </div>
                    <div className="text-xs text-gray-300">
                      {player.address?.slice(0, 6)}...{player.address?.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="text-white font-bold text-lg">
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center space-y-2">
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {lastUpdated && (
            <div className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};