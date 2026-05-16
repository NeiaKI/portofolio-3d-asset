import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": ["3D-ASSET/**/*"],
  },
  outputFileTracingIncludes: {
    "*": [
      "public/3D-ASSET/**/*.json",
      "data/assets-manifest.json",
      "data/profile.json",
    ],
  },
};

export default nextConfig;
