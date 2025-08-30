import { createConfig, http } from 'wagmi';
import { MONAD_TESTNET } from './config.js';

// Wagmi configuration for Monad Testnet
export const wagmiConfig = createConfig({
  chains: [MONAD_TESTNET],
  transports: {
    [MONAD_TESTNET.id]: http(MONAD_TESTNET.rpcUrls.default.http[0]),
  },
});