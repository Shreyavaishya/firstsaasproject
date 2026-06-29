import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔹 Type-safe way to increase file limits across the app
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;