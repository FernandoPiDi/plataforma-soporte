import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable watching for file changes in Docker
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
