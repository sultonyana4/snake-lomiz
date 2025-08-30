import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { MONAD_GAMES_CONTRACT_ABI } from '../../../../lib/contracts.js';
import { MONAD_GAMES_CONFIG } from '../../../../lib/config.js';

const CONTRACT_ADDRESS = MONAD_GAMES_CONFIG.GAME_ID_CONTRACT;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.monad.xyz';

export async function GET() {
  try {
    const checks = {
      rpcConnection: false,
      contractAccess: false,
      walletConfiguration: false,
      walletBalance: '0',
      blockNumber: 0,
      timestamp: new Date().toISOString()
    };

    // Check RPC connection
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const blockNumber = await provider.getBlockNumber();
      checks.rpcConnection = true;
      checks.blockNumber = blockNumber;
    } catch (error) {
      console.error('RPC connection failed:', error);
    }

    // Check wallet configuration
    if (process.env.WALLET_PRIVATE_KEY) {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        
        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        checks.walletConfiguration = true;
        checks.walletBalance = ethers.formatEther(balance);
        checks.walletAddress = wallet.address;
      } catch (error) {
        console.error('Wallet check failed:', error);
      }
    }

    // Check contract access
    if (checks.rpcConnection && checks.walletConfiguration) {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MONAD_GAMES_CONTRACT_ABI, wallet);
        
        // Try to read from contract (this should work even without special permissions)
        await contract.DEFAULT_ADMIN_ROLE();
        checks.contractAccess = true;
      } catch (error) {
        console.error('Contract access failed:', error);
      }
    }

    const allHealthy = checks.rpcConnection && checks.contractAccess && checks.walletConfiguration;

    return NextResponse.json({
      healthy: allHealthy,
      checks,
      config: {
        contractAddress: CONTRACT_ADDRESS,
        rpcUrl: RPC_URL,
        hasPrivateKey: !!process.env.WALLET_PRIVATE_KEY
      }
    }, {
      status: allHealthy ? 200 : 503
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}