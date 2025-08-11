import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { getClientIP, generateSessionId } from "@/lib/utils";

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
    const ipAddress = getClientIP(request);
    const sessionId = generateSessionId();

    const prisma = await getPrisma();
    
    // Check if user has voted for this specific poll (logged in or anonymous)
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: params.id,
        OR: [
          { userId: session?.user?.id || null },
          { sessionId: sessionId },
          { ipAddress: ipAddress },
        ],
      }
    });

    return NextResponse.json({ hasVoted: !!existingVote });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 }
    );
  }
}
