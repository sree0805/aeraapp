import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress specific source map warnings often found in dev
  webpack: (config, { dev }) => {
    if (dev) {
      config.ignoreWarnings = [
        { module: /node_modules/ },
        { file: /node_modules/ },
      ];
    }
    return config;
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },

};

export default nextConfig;
