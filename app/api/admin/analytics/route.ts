import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db-optimized";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get basic analytics data
    const [totalUsers, totalPolls, totalVotes] = await Promise.all([
      prisma.user.count(),
      prisma.poll.count(),
      prisma.vote.count(),
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPolls,
        totalVotes,
        activePolls: 0, // Simplified for now
        recentActivity: 0 // Simplified for now
      },
      topPolls: [], // Simplified for now
      growth: {
        newUsersLast30Days: 0 // Simplified for now
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}