/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure API routes to be dynamic
  async headers() {
    return [
      {
        source: '/api/stats',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/api/polls',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=30',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Optimize images
  images: {
    domains: ["localhost"],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Optimize builds
  swcMinify: true,
  // Enable static optimization
  trailingSlash: false,
  // Remove manual webpack optimization overrides (use Next.js defaults)
  // Enable poweredByHeader for debugging (disable in production)
  poweredByHeader: false,
  // Optimize page loading
  reactStrictMode: true,
  // Enable static generation where possible
  output: 'standalone',
  // Optimize CSS
  optimizeFonts: true,
  // Enable experimental features for performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@prisma/client', 'next-auth', 'bcryptjs', 'lucide-react', 'framer-motion'],
    // Enable server components
    serverComponentsExternalPackages: ['@prisma/client'],
    // Disabled to avoid missing 'critters' module during build
    // optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
