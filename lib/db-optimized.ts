import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const dbUtils = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  },

  async findPollWithVotes(id: string) {
    return prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { votes: true }
        }
      },
    });
  },

  async findManyPolls(take = 10, skip = 0) {
    return prisma.poll.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { votes: true }
        }
      },
    });
  },

  async getAdminStats() {
    const [totalUsers, totalPolls, totalVotes, recentPolls] = await Promise.all([
      prisma.user.count(),
      prisma.poll.count(),
      prisma.vote.count(),
      prisma.poll.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: { votes: true }
          }
        }
      })
    ]);

    return {
      totalUsers,
      totalPolls,
      totalVotes,
      recentPolls: recentPolls.map(poll => ({
        id: poll.id,
        title: poll.title,
        createdAt: poll.createdAt.toISOString(),
        _count: poll._count
      }))
    };
  },
};
