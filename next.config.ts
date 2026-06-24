import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow local uploaded images to be served without optimization pipeline
    unoptimized: true,
  },
  // Ensures Prisma client is treated as a server-only module
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig
