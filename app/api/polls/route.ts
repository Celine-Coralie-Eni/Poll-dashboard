import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db-optimized';

export async function GET() {
  try {
    // Use optimized database utility with caching
    const polls = await dbUtils.findManyPolls(20, 0);

    const response = NextResponse.json(polls);

    // Add caching headers for 30 seconds
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}
 