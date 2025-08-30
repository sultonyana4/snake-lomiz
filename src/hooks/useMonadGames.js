'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import toast from 'react-hot-toast';

export const useMonadGames = () => {
  const { authenticated, user } = usePrivy();
  const walletAddress = user?.wallet?.address;



  const updateScore = async (gameData) => {
    if (!authenticated || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('Updating score on blockchain:', {
        player: walletAddress,
        scoreAmount: gameData.score,
        transactionAmount: gameData.transactionAmount || 0
      });

      // Validate inputs
      if (!gameData.score || gameData.score < 0) {
        throw new Error('Invalid score value');
      }

      // Use API route for blockchain interaction
      const response = await fetch('/api/blockchain/update-player-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: walletAddress,
          scoreAmount: gameData.score,
          transactionAmount: gameData.transactionAmount || 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const result = await response.json();
      console.log('Score updated via API:', result);
      
      toast.success('Score successfully saved to blockchain!');
      return { success: true, method: 'api', ...result };
    } catch (err) {
      const errorMessage = err?.message || 'Unknown error occurred';
      console.error('Score update error:', errorMessage, err);
      toast.error(`Failed to save score: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  return {
    isAuthenticated: authenticated,
    isRegistered: true, // For blockchain games, registration happens on first interaction
    isLoading: false,
    error: null,
    walletAddress,
    updateScore,
  };
};