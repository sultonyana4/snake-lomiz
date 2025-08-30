'use client';

import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';

export const AuthStatus = () => {
  const { 
    authenticated, 
    ready, 
    isMonadGamesUser, 
    getWalletAddress, 
    getUserIdentifier 
  } = useMonadGamesAuth();

  if (!ready) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-yellow-400">Loading authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-red-400">Not authenticated</div>
      </div>
    );
  }

  const userInfo = getUserIdentifier();
  const address = getWalletAddress();

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-green-400 font-semibold">Authenticated</span>
      </div>
      
      {isMonadGamesUser && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-purple-400 font-semibold">Monad Games ID</span>
        </div>
      )}

      <div className="text-sm text-gray-300">
        <div><strong>Type:</strong> {userInfo?.type || 'unknown'}</div>
        <div><strong>Address:</strong> {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'N/A'}</div>
        {userInfo?.email && (
          <div><strong>Email:</strong> {userInfo.email}</div>
        )}
      </div>
    </div>
  );
};