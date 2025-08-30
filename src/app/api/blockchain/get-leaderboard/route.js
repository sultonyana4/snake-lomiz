import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const gameId = searchParams.get('gameId') || '117';
    const sortBy = searchParams.get('sortBy') || 'scores';

    // Fetch leaderboard data from Monad Games ID website
    const leaderboardUrl = `https://monad-games-id-site.vercel.app/api/leaderboard?page=${page}&gameId=${gameId}&sortBy=${sortBy}`;
    
    console.log('Fetching leaderboard from:', leaderboardUrl);

    const response = await fetch(leaderboardUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Snake-Lomiz-Game/1.0'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Leaderboard API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
      source: 'monad-games-id',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch leaderboard',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}