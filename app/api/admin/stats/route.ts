import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db-optimized';

export async function GET() {
  try {
    const stats = await dbUtils.getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}