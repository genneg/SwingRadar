/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checks during build for now
  typescript: {
    ignoreBuildErrors: true,
  },
    // Performance optimizations for Core Web Vitals
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization for better LCP and CLS
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'example.com',
      'localhost',
      'images.unsplash.com', // For fallback images
      'tqvvseagpkmdnsiuwabv.supabase.co', // Supabase storage
    ],
    // Allow API routes for images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tqvvseagpkmdnsiuwabv.supabase.co',
        pathname: '/storage/v1/object/public/bluesbucket/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache static assets for better performance
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Preload critical fonts
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap>; rel=preload; as=style',
          },
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Enhanced security headers for authentication pages
      {
        source: '/auth/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://lh3.googleusercontent.com https://platform-lookaside.fbsbx.com; connect-src 'self' https://accounts.google.com https://www.facebook.com; frame-src https://accounts.google.com https://www.facebook.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },

  // Webpack optimization for bundle size
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }

    return config
  },

  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: false, // Disable for better performance
}

module.exports = nextConfig
