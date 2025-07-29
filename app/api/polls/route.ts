import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPollSchema = z.object({
  title: z.string().min(1, "Poll title is required"),
  description: z.string().optional(),
  options: z
    .array(z.string().min(1, "Option text is required"))
    .min(2, "At least 2 options are required"),
});

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      where: { isActive: true },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPollSchema.parse(body);

    const poll = await prisma.poll.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        options: {
          create: validatedData.options.map((text) => ({ text })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
 