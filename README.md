This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:
- `WALLET_PRIVATE_KEY`: Your wallet private key (must have GAME_ROLE)
- `API_SECRET`: Generate with `openssl rand -hex 32`
- `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy app ID (get from Privy Dashboard)

**Note:** The Monad Games ID Cross App ID (`cmd8euall0037le0my79qpz42`) is already configured in the code.

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Monad Games ID Integration

This game integrates with **Monad Games ID** for universal gaming identity across the Monad ecosystem:

### Features
- **Sign in with Monad Games ID**: Dedicated login button for seamless cross-game authentication
- **Universal Identity**: Your gaming identity works across all Monad Games
- **Fallback Authentication**: Support for MetaMask, Coinbase Wallet, WalletConnect, and email/SMS
- **Smart Contract Integration**: Connected to Monad Games contracts:
  - Game ID Contract: `0xceCBFF203C8B6044F52CE23D914A1bfD997541A4`
  - Snake Lomiz Contract: `0x48d3eF068e43a7ce548d929Ae5af0F2134487c62`

### Authentication Flow
1. **Preferred**: Sign in with Monad Games ID for cross-game compatibility
2. **Alternative**: Connect with any supported wallet or email/SMS
3. **Automatic Registration**: Players are automatically registered with the Monad Games system
4. **Score Tracking**: All scores are saved to the blockchain with proper authentication context

### Technical Details
- Uses Privy's `loginMethodsAndOrder` with cross-app authentication
- Cross App ID: `cmd8euall0037le0my79qpz42`
- Supports both Monad Games ID users and regular wallet users
- Enhanced user identification for better game analytics

### Blockchain-First Architecture
This game uses **direct blockchain interaction** instead of external APIs for maximum decentralization and reliability.

**Smart Contract Integration:**
- **Direct Contract Calls**: Score updates go directly to the blockchain via `updatePlayerData(address, uint256, uint256)`
- **No External Dependencies**: No reliance on external APIs that might be unavailable
- **Automatic Registration**: Players are registered on their first score update
- **Real-time Updates**: Immediate blockchain confirmation for all game actions

**Environment Variables:**
```bash
# Your wallet private key (must have GAME_ROLE on the contract)
WALLET_PRIVATE_KEY=your_private_key_here

# Optional: Custom RPC URL (defaults to official Monad RPC)
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.monad.xyz
```

**Blockchain Health Check:**
The app includes a blockchain connectivity check to verify your wallet and RPC connection.

### Learn More
- **Monad Games ID Website**: https://monad-games-id-site.vercel.app/
- **Privy Cross-App Documentation**: [Login with a global wallet - Privy Docs](https://docs.privy.io/guide/react/recipes/cross-app)

### Troubleshooting
If you encounter blockchain connectivity issues:
1. **Check Private Key**: Ensure `WALLET_PRIVATE_KEY` is set and has GAME_ROLE permissions
2. **Verify RPC Connection**: Test if `https://testnet-rpc.monad.xyz` is accessible
3. **Check Wallet Balance**: Ensure the wallet has enough MON tokens for gas fees
4. **Contract Permissions**: Verify your wallet has the required role on the smart contract

### Smart Contract Functions Used:
```solidity
function updatePlayerData(
    address player,
    uint256 scoreAmount,
    uint256 transactionAmount
) external;
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
