import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit local preview hosts; production origin checks remain unchanged.
  allowedDevOrigins: ["127.0.0.1", "192.168.1.187", "192.168.1.160", "aissam.tail90f779.ts.net"],
  cacheComponents: true,
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
