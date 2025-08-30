import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { MONAD_GAMES_CONTRACT_ABI } from '../../../../lib/contracts.js';
import { MONAD_GAMES_CONFIG } from '../../../../lib/config.js';

// Contract configuration
const CONTRACT_ADDRESS = MONAD_GAMES_CONFIG.GAME_ID_CONTRACT;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.monad.xyz';

export async function POST(request) {
  try {
    // Validate environment variables
    if (!process.env.WALLET_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: WALLET_PRIVATE_KEY not set' },
        { status: 500 }
      );
    }

    // Parse request body
    const { player, scoreAmount, transactionAmount = 0 } = await request.json();

    // Validate inputs
    if (!player || !ethers.isAddress(player)) {
      return NextResponse.json(
        { error: 'Invalid player address' },
        { status: 400 }
      );
    }

    if (!scoreAmount || scoreAmount < 0) {
      return NextResponse.json(
        { error: 'Invalid score amount' },
        { status: 400 }
      );
    }

    console.log('Updating player data:', {
      player,
      scoreAmount,
      transactionAmount,
      contract: CONTRACT_ADDRESS
    });

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MONAD_GAMES_CONTRACT_ABI, wallet);

    // Call updatePlayerData function
    const tx = await contract.updatePlayerData(
      player,
      BigInt(Math.floor(scoreAmount)),
      BigInt(Math.floor(transactionAmount))
    );

    console.log('Transaction submitted:', tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log('Transaction confirmed:', {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      player,
      scoreAmount,
      transactionAmount
    });

  } catch (error) {
    console.error('Blockchain update error:', error);
    
    // Handle specific error types
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds for gas fees';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network connection error';
    } else if (error.message?.includes('execution reverted')) {
      errorMessage = 'Smart contract execution failed - check wallet permissions';
      statusCode = 403;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.code || 'UNKNOWN_ERROR'
      },
      { status: statusCode }
    );
  }
}