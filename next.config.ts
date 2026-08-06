import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // framer-motion is not in Next's default optimize list. Rewriting the
    // barrel import to the resolved modules keeps the animation components
    // working exactly as written while trimming the shared client chunk.
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
