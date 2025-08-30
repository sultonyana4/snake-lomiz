'use client';

import { useState, useEffect } from 'react';
import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';

export const BlockchainStatus = () => {
  const { authenticated, getWalletAddress, isMonadGamesUser } = useMonadGamesAuth();
  const address = getWalletAddress();
  const [healthStatus, setHealthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blockchain/health');
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ healthy: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (!authenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
        ❌ Wallet not connected
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </div>
        {isMonadGamesUser && (
          <div className="text-xs text-purple-400 mt-1">
            ✨ Monad Games ID
          </div>
        )}
      </div>
      
      {healthStatus && (
        <div className={`px-3 py-2 rounded-lg text-sm ${
          healthStatus.healthy ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <div className="flex items-center gap-2">
            <span>{healthStatus.healthy ? '✅' : '❌'}</span>
            <span>Blockchain: {healthStatus.healthy ? 'Connected' : 'Error'}</span>
          </div>
          {!healthStatus.healthy && healthStatus.error && (
            <div className="text-xs mt-1 opacity-75">
              {healthStatus.error}
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={checkHealth}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
      >
        {isLoading ? 'Checking...' : 'Check Status'}
      </button>
    </div>
  );
};