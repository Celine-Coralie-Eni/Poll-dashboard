import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only access their own stats, or admins can access any user's stats
    if (session.user.id !== params.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const prisma = await getPrisma();
    
    // Get user's polls and votes
    // Count polls created by this user (using createdById if available). If the schema was
    // just migrated and older rows have null createdById, best-effort attribute polls when
    // there is only one user in the system.
    let pollsCreated = await prisma.poll.count({ where: { createdById: params.id } });
    const votesCast = await prisma.vote.count({ where: { userId: params.id } });

    if (pollsCreated === 0) {
      const totalUsers = await prisma.user.count();
      if (totalUsers === 1) {
        // Attribute existing polls to the only user (bootstrap scenario)
        pollsCreated = await prisma.poll.count();
      }
    }

    return NextResponse.json({
      pollsCreated,
      votesCast
    });

  } catch (error) {
    console.error('User stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await request.json();
    
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const prisma = await getPrisma();
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent admin from deleting themselves
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}