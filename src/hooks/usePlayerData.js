'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { MONAD_GAMES_CONTRACT } from '../lib/contracts.js';

export const usePlayerData = () => {
  const { address, isConnected } = useAccount();
  const [totalScore, setTotalScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Read total score from contract
  const { data: totalScoreData, isLoading: totalScoreLoading } = useReadContract({
    ...MONAD_GAMES_CONTRACT,
    functionName: 'totalScoreOfPlayer',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  // Read game-specific score from contract
  const { data: gameScoreData, isLoading: gameScoreLoading } = useReadContract({
    ...MONAD_GAMES_CONTRACT,
    functionName: 'playerDataPerGame',
    args: address ? [MONAD_GAMES_CONTRACT.address, address] : undefined,
    enabled: !!address && isConnected,
  });

  useEffect(() => {
    try {
      if (totalScoreData !== undefined && totalScoreData !== null) {
        const score = typeof totalScoreData === 'bigint' ? Number(totalScoreData) : Number(totalScoreData);
        setTotalScore(isNaN(score) ? 0 : score);
      }
    } catch (error) {
      console.error('Error processing total score data:', error);
      setTotalScore(0);
    }
  }, [totalScoreData]);

  useEffect(() => {
    try {
      if (gameScoreData && Array.isArray(gameScoreData)) {
        const score = typeof gameScoreData[0] === 'bigint' ? Number(gameScoreData[0]) : Number(gameScoreData[0] || 0);
        setGameScore(isNaN(score) ? 0 : score);
      }
    } catch (error) {
      console.error('Error processing game score data:', error);
      setGameScore(0);
    }
  }, [gameScoreData]);

  useEffect(() => {
    setIsLoading(totalScoreLoading || gameScoreLoading);
  }, [totalScoreLoading, gameScoreLoading]);

  return {
    totalScore,
    gameScore,
    isLoading,
  };
};