import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-optimized';

export async function GET() {
  try {
    // Fetch real-time stats from database
    const [totalUsers, totalPolls, totalVotes] = await Promise.all([
      prisma.user.count(),
      prisma.poll.count(),
      prisma.vote.count(),
    ]);

    console.log('Stats API called - Database counts:', { totalUsers, totalPolls, totalVotes });

    const response = NextResponse.json({
      totalUsers,
      totalPolls,
      totalVotes,
    });

    // Add caching headers for 30 seconds
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
