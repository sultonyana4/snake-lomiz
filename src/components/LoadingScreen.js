'use client';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
        <h2 className="text-2xl font-semibold text-white mb-2">Loading Snake Lomiz</h2>
        <p className="text-gray-400">Initializing game...</p>
      </div>
    </div>
  );
}