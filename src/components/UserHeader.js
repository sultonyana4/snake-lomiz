'use client';

import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';
import { useMonadGamesUser } from '../hooks/useMonadGamesUser.js';

export const UserHeader = () => {
  const { authenticated, logout, walletAddress, isMonadGamesUser } = useMonadGamesAuth();
  const { user: monadUser, hasUsername } = useMonadGamesUser(walletAddress);

  // Show header if authenticated
  if (!authenticated) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-800 rounded-lg p-3 text-white text-sm shadow-lg z-50">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          {hasUsername && monadUser ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-purple-400 font-medium">
                {monadUser.username}
              </span>
            </div>
          ) : isMonadGamesUser ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <a 
                href="https://monad-games-id-site.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 text-xs underline"
              >
                Register Username
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="text-gray-300 text-xs">Not linked</span>
            </div>
          )}
          
          {walletAddress && (
            <div className="text-xs text-gray-400 mt-1">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};