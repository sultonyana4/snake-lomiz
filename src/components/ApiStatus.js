'use client';

import { useState, useEffect } from 'react';
import { monadGamesService } from '../services/monadGamesService.js';

export const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBlockchainStatus = async () => {
      try {
        const status = await monadGamesService.checkBlockchainHealth();
        setApiStatus(status);
      } catch (error) {
        setApiStatus({
          available: false,
          status: 0,
          message: 'Failed to check blockchain status',
          error: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkBlockchainStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="text-yellow-400 text-sm">Checking blockchain status...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${apiStatus?.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="text-sm font-semibold text-white">Blockchain Connection</span>
      </div>
      
      <div className="text-xs text-gray-300">
        <div>Status: {apiStatus?.message || 'Unknown'}</div>
        {apiStatus?.status && (
          <div>HTTP: {apiStatus.status}</div>
        )}
        {apiStatus?.error && (
          <div className="text-red-400">Error: {apiStatus.error}</div>
        )}
      </div>

      {!apiStatus?.available && (
        <div className="mt-2 text-xs text-yellow-400">
          ⚠️ Blockchain connection failed. Check WALLET_PRIVATE_KEY and RPC URL.
        </div>
      )}
    </div>
  );
};