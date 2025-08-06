import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db-optimized';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all polls with their options and vote counts
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Generate CSV content
    const csvRows = [];
    csvRows.push('Poll ID,Poll Title,Poll Description,Created At,Is Active,Total Votes,Option Text,Option Votes');

    polls.forEach(poll => {
      const baseData = [
        poll.id,
        `"${poll.title.replace(/"/g, '""')}"`,
        `"${poll.description?.replace(/"/g, '""') || ''}"`,
        poll.createdAt.toISOString(),
        poll.isActive ? 'Yes' : 'No',
        poll._count.votes.toString()
      ];

      if (poll.options.length === 0) {
        csvRows.push([...baseData, '', '0'].join(','));
      } else {
        poll.options.forEach(option => {
          const row = [
            ...baseData,
            `"${option.text.replace(/"/g, '""')}"`,
            option._count.votes.toString()
          ];
          csvRows.push(row.join(','));
        });
      }
    });

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="poll-results.csv"',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export poll results' },
      { status: 500 }
    );
  }
}