import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid workspace-root confusion when the monorepo has multiple lockfiles.
    root: __dirname,
  },
}

export default nextConfig
