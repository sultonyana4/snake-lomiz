'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  if (!privyAppId) {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Configuration Error: Privy App ID not set</div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethodsAndOrder: {
          // This is the correct format for Monad Games ID integration
          // The Cross App ID must be prefixed with "privy:"
          primary: ["privy:cmd8euall0037le0my79qpz42"], // DO NOT CHANGE THIS
        },
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://monad-games-id-site.vercel.app/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}