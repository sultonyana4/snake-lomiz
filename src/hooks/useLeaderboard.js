'use client';

import { useState, useEffect } from 'react';

export const useLeaderboard = (limit = 10, autoRefresh = false) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from Monad Games ID API first
      try {
        const response = await fetch('/api/blockchain/get-leaderboard?gameId=117&sortBy=scores&page=1');
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data?.players) {
            const formattedPlayers = result.data.players
              .slice(0, limit)
              .map((player, index) => ({
                address: player.address || player.wallet || 'Unknown',
                score: player.score || player.totalScore || 0,
                username: player.username || `Player_${(player.address || '').slice(-6)}`,
                rank: index + 1,
              }));
            
            setLeaderboard(formattedPlayers);
            setLastUpdated(new Date());
            setIsLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.warn('API leaderboard fetch failed, trying blockchain fallback:', apiError);
      }

      // If API fails, show empty leaderboard for now
      console.warn('Leaderboard API failed, showing empty leaderboard');
      setLeaderboard([]);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch leaderboard';
      console.error('Failed to fetch leaderboard:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, limit]);

  return {
    leaderboard,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchLeaderboard,
  };
};