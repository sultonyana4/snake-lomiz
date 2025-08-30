'use client';

import { Logo } from './Logo.js';
import { useMonadGamesAuth } from '../hooks/useMonadGamesAuth.js';

export const LoginScreen = () => {
  const { authenticated, ready, login, hasLinkedAccount, walletAddress } = useMonadGamesAuth();

  // Don't render anything until Privy is ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If authenticated but no linked account, show message to link Monad Games ID
  if (authenticated && !hasLinkedAccount) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Logo size={64} />
            <h1 className="text-3xl font-bold text-white">Snake Lomiz</h1>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl text-red-400 mb-2">Account Setup Required</h2>
            <p className="text-gray-300 text-sm">
              You need to link your Monad Games ID account to continue playing.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={login}
              className="w-full px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Link Monad Games ID
            </button>
            
            <div className="text-xs text-gray-400">
              <p>This will connect your account to Monad Games ecosystem</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and has linked account but no wallet address, show loading
  if (authenticated && hasLinkedAccount && !walletAddress) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Setting up your wallet...</div>
      </div>
    );
  }

  // If fully authenticated with wallet, don't show login screen
  if (authenticated && walletAddress) {
    return null;
  }

  // Show login screen for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Logo size={64} />
          <h1 className="text-3xl font-bold text-white">Snake Lomiz</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl text-white mb-2">Welcome to Snake Lomiz!</h2>
          <p className="text-gray-300 text-sm">
            Sign in with Monad Games ID to play and save your scores on the blockchain
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={login}
            className="w-full px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Sign in with Monad Games ID
          </button>
          
          <div className="text-xs text-gray-400">
            <p>Powered by Monad Games ID</p>
            <p>Your scores will be saved on Monad blockchain</p>
          </div>
        </div>

        <div className="mt-6 text-left text-gray-300 text-sm">
          <h3 className="font-semibold mb-2">What is Monad Games ID?</h3>
          <ul className="space-y-1 text-xs">
            <li>• Universal gaming identity across Monad ecosystem</li>
            <li>• Secure blockchain-based score tracking</li>
            <li>• Cross-game leaderboards and achievements</li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">New to Monad Games ID?</p>
            <a 
              href="https://monad-games-id-site.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-xs underline"
            >
              Learn more about universal gaming identity →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};