import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'puppeteer']
  },
  // Add this to ignore lint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optionally, also ignore TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;