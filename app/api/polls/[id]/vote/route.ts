import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { getClientIP, generateSessionId } from "@/lib/utils";
import { z } from "zod";

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

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = voteSchema.parse(body);

    const authOptions = await getAuthOptions();
    const session = await getServerSession(authOptions);
    const ipAddress = getClientIP(request);
    const sessionId = generateSessionId();

    const prisma = await getPrisma();
    // Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
      include: { options: true },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    if (!poll.isActive) {
      return NextResponse.json(
        { error: "Poll is not active" },
        { status: 400 }
      );
    }

    // Check if option exists
    const option = poll.options.find(
      (opt) => opt.id === validatedData.optionId
    );
    if (!option) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    // Check for existing vote
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: params.id,
        OR: [
          { userId: session?.user?.id || null },
          { sessionId: sessionId },
          { ipAddress: ipAddress },
        ],
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this poll" },
        { status: 400 }
      );
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        pollId: params.id,
        optionId: validatedData.optionId,
        userId: session?.user?.id || null,
        sessionId: sessionId,
        ipAddress: ipAddress,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
