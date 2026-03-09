import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pensar/ui", "@pensar/lib"],
  turbopack: {
    resolveAlias: {
      canvas: { browser: "" },
    },
  },
};

export default nextConfig;
