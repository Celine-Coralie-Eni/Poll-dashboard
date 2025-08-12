import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
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

// Enhanced cache with TTL and size limits
class Cache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly maxSize = 100;
  private readonly defaultTTL = 60000; // 60 seconds

  get(key: string, ttl = this.defaultTTL) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  set(key: string, data: any, ttl = this.defaultTTL) {
    // Implement basic eviction when over capacity
    if (this.cache.size >= this.maxSize) {
      const first = this.cache.keys().next();
      if (!first.done) {
        this.cache.delete(first.value);
      }
    }
    
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(pattern?: string) {
    if (pattern) {
      for (const k of this.cache.keys()) {
        if (k.includes(pattern)) {
          this.cache.delete(k);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  size() {
    return this.cache.size;
  }
}

const cache = new Cache();

export const dbUtils = {
  async findUserByEmail(email: string) {
    const cacheKey = `user:${email}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const result = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });

    if (result) {
      cache.set(cacheKey, result);
    }
    return result;
  },

  async findPollWithVotes(id: string) {
    const cacheKey = `poll:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const result = await prisma.poll.findUnique({
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

    if (result) {
      cache.set(cacheKey, result);
    }
    return result;
  },

  async findManyPolls(take = 10, skip = 0) {
    const cacheKey = `polls:${take}:${skip}`;
    const cached = cache.get(cacheKey, 30000); // 30 second cache for polls list
    if (cached) return cached;

    const result = await prisma.poll.findMany({
      take,
      skip,
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            _count: {
              select: { votes: true }
            }
          }
        },
        _count: {
          select: { votes: true }
        }
      },
    });

    cache.set(cacheKey, result, 30000);
    return result;
  },

  async getAdminStats() {
    const cacheKey = 'admin:stats';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

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

    const result = {
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

    cache.set(cacheKey, result);
    return result;
  },

  // Clear cache when data changes
  clearCache(pattern?: string) {
    cache.clear(pattern);
  },

  // Get cache statistics
  getCacheStats() {
    return {
      size: cache.size(),
    };
  },
};
