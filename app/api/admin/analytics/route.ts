import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamic import to avoid build-time issues
async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/db-optimized');
    return prisma;
  } catch (error) {
    console.error('Failed to import Prisma client:', error);
    throw new Error('Database connection failed');
  }
}

export async function GET() {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = await getPrisma();
    
    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Fetch analytics data
    const [totalUsers, totalPolls, totalVotes, activePolls, newUsersLast30Days, topPolls] = await Promise.all([
      prisma.user.count(),
      prisma.poll.count(),
      prisma.vote.count(),
      prisma.poll.count({ where: { isActive: true } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.poll.findMany({
        take: 5,
        orderBy: { votes: { _count: 'desc' } },
        select: {
          id: true,
          title: true,
          _count: { select: { votes: true } }
        }
      })
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPolls,
        totalVotes,
        activePolls,
        recentActivity: newUsersLast30Days
      },
      topPolls: topPolls.map(poll => ({
        id: poll.id,
        title: poll.title,
        voteCount: poll._count.votes
      })),
      growth: {
        newUsersLast30Days
      }
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}