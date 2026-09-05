import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disables ESLint running automatically during 'next build' on Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: set to true if you also want to skip type-checking during builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;