/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@prisma/client', 'next-auth', 'bcryptjs'],
  },
  // Configure API routes to be dynamic
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Optimize images
  images: {
    domains: ["localhost"],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable compression
  compress: true,
  // Optimize builds
  swcMinify: true,
  // Enable static optimization
  trailingSlash: false,
  // Optimize webpack bundle
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  // Enable poweredByHeader for debugging (disable in production)
  poweredByHeader: false,
  // Optimize page loading
  reactStrictMode: true,
};

module.exports = nextConfig;
