'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function SimplePage() {
  const { login, logout, authenticated, user, ready } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Privy...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Snake Lomiz</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to play and save scores to Monad blockchain</p>
          
          <button
            onClick={login}
            className="w-full px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-6">🐍 Snake Lomiz</h1>
        
        <div className="mb-6">
          <p className="text-green-400 mb-2">✅ Wallet Connected!</p>
          <p className="text-gray-300 text-sm">
            Address: {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            🎮 Play Game
          </button>
          
          <button
            onClick={logout}
            className="w-full px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <p>✅ Blockchain Integration Ready</p>
          <p>✅ Automatic Score Sync</p>
        </div>
      </div>
    </div>
  );
}