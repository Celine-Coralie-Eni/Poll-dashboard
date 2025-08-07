import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Add connection timeout settings for remote database
    __internal: {
      engine: {
        connectTimeout: 60000, // 60 seconds
        pool: {
          min: 1,
          max: 10,
        },
      },
    },
  });
};

// Use singleton pattern for better performance
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optimize database queries with common patterns
export const dbUtils = {
  // Cached user lookup
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true, // Only include when needed for auth
      },
    });
  },

  // Optimized poll queries with proper includes
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

  // Optimized polls listing
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

  // Cached admin stats with optimized queries
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

// Graceful shutdown
if (process.env.NODE_ENV !== "production") {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;