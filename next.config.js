/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@prisma/client', 'next-auth', 'bcryptjs'],
  },
  // Optimize images
  images: {
    domains: ["localhost"],
    formats: ['image/webp', 'image/avif'],
  },
  // Environment variables
  env: {
    TOLGEE_API_KEY: process.env.TOLGEE_API_KEY,
    TOLGEE_API_URL: process.env.TOLGEE_API_URL,
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
