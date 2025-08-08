import { NextResponse } from 'next/server';

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
    const prisma = await getPrisma();
    
    // Find the user with the specific email
    const user = await prisma.user.findUnique({
      where: { email: 'calinecoralie0@gmail.com' },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found. Please sign in with Google OAuth first.',
        email: 'calinecoralie0@gmail.com'
      });
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json({
        success: true,
        message: 'User is already an admin!',
        user: user
      });
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email: 'calinecoralie0@gmail.com' },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true }
    });

    return NextResponse.json({
      success: true,
      message: 'User is now an admin! Please sign out and sign back in.',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to set up admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
