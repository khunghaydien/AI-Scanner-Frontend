import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-773a2ba3ac514fd4a606b2aebda82b53.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '7be6030895597268a2f7a5484bde7e33.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // Enable partial prerendering for better LCP
    ppr: false, // Can enable if needed
  },
  // Optimize output
  output: 'standalone', // Optional: for better deployment performance
  // Reduce JavaScript bundle size
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
};

export default withNextIntl(nextConfig);
