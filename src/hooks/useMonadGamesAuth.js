'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

const MONAD_GAMES_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';

export const useMonadGamesAuth = () => {
  const { user, authenticated, ready, logout, login } = usePrivy();
  const [isMonadGamesUser, setIsMonadGamesUser] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (authenticated && user && ready) {
      // Check if user has linkedAccounts (cross-app authentication)
      if (user.linkedAccounts && user.linkedAccounts.length > 0) {
        // Get the cross app account created using Monad Games ID
        const crossAppAccount = user.linkedAccounts.find(
          account => account.type === 'cross_app' && 
          account.providerApp?.id === MONAD_GAMES_CROSS_APP_ID
        );

        if (crossAppAccount && crossAppAccount.embeddedWallets && crossAppAccount.embeddedWallets.length > 0) {
          // The first embedded wallet created using Monad Games ID is the wallet address
          const address = crossAppAccount.embeddedWallets[0].address;
          setWalletAddress(address);
          setIsMonadGamesUser(true);
        } else {
          setIsMonadGamesUser(false);
          setWalletAddress('');
        }
      } else {
        // No linked accounts - user needs to link Monad Games ID
        setIsMonadGamesUser(false);
        setWalletAddress('');
      }
    } else {
      setIsMonadGamesUser(false);
      setWalletAddress('');
    }
  }, [authenticated, user, ready]);

  const getWalletAddress = () => {
    return walletAddress;
  };

  const getUserIdentifier = () => {
    if (isMonadGamesUser && walletAddress) {
      return {
        type: 'monad_games_id',
        address: walletAddress,
        crossAppId: MONAD_GAMES_CROSS_APP_ID,
      };
    }

    return null;
  };

  const hasLinkedAccount = () => {
    return authenticated && user && user.linkedAccounts && user.linkedAccounts.length > 0;
  };

  return {
    // Privy auth state
    authenticated,
    ready,
    user,
    logout,
    login,
    
    // Monad Games ID specific
    isMonadGamesUser,
    walletAddress,
    hasLinkedAccount: hasLinkedAccount(),
    
    // Utility functions
    getWalletAddress,
    getUserIdentifier,
  };
};