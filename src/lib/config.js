// Monad Testnet configuration
export const MONAD_TESTNET = {
    id: 10143,
    name: 'Monad Testnet',
    network: 'monad-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'MON',
        symbol: 'MON',
    },
    rpcUrls: {
        public: { http: ['https://testnet-rpc.monad.xyz'] },
        default: { http: ['https://testnet-rpc.monad.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Monad Explorer', url: 'https://testnet-explorer.monad.xyz' },
    },
    testnet: true,
};

// Game configuration
export const GAME_CONFIG = {
    name: 'Snake Lomiz',
    gameId: 'snake-lomiz',
    version: '1.0.0',
};

// Monad Games ID configuration
export const MONAD_GAMES_CONFIG = {
    CROSS_APP_ID: 'cmd8euall0037le0my79qpz42',
    GAME_ID_CONTRACT: '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4',
    SNAKE_LOMIZ_CONTRACT: '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4', // Use the same contract as shown in the image
    WEBSITE_URL: 'https://monad-games-id-site.vercel.app/',
};

// Blockchain API configuration - Direct smart contract interaction
export const BLOCKCHAIN_API = {
    ENDPOINTS: {
        UPDATE_PLAYER_DATA: '/api/blockchain/update-player-data',
        REGISTER_PLAYER: '/api/blockchain/register-player',
        GET_LEADERBOARD: '/api/blockchain/get-leaderboard',
        HEALTH_CHECK: '/api/blockchain/health',
    },
};
