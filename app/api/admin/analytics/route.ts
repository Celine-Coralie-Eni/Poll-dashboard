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

    // Get analytics data
    const [
      totalUsers,
      totalPolls,
      totalVotes,
      activePolls,
      recentActivity,
      userGrowth
    ] = await Promise.all([
      // Basic stats
      prisma.user.count(),
      prisma.poll.count(),
      prisma.vote.count(),
      prisma.poll.count({ where: { isActive: true } }),
      
      // Recent activity (last 7 days)
      prisma.vote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // User growth (last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get top polls separately to avoid complex orderBy
    const topPolls = await prisma.poll.findMany({
      take: 5,
      include: {
        _count: { select: { votes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPolls,
        totalVotes,
        activePolls,
        recentActivity
      },
      topPolls: topPolls.map(poll => ({
        id: poll.id,
        title: poll.title,
        votes: poll._count.votes,
        createdAt: poll.createdAt.toISOString()
      })),
      growth: {
        newUsersLast30Days: userGrowth
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