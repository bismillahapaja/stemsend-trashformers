import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase Storage images (production)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Keep unoptimized for local development fallback
    unoptimized: true,
  },
  // Ensures Prisma client is treated as a server-only module
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig
