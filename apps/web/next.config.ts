import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Library uploads use Server Actions + multipart FormData.
    // Set this above our 20 MB app-level validation to account for multipart overhead.
    proxyClientMaxBodySize: 25 * 1024 * 1024,
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  transpilePackages: ["@pensar/ui", "@pensar/lib"],
  turbopack: {
    resolveAlias: {
      canvas: { browser: "" },
    },
  },
};

export default nextConfig;
