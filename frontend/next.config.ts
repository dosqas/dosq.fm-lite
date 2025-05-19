import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@src": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@context": path.resolve(__dirname, "src/context"),
      "@menus": path.resolve(__dirname, "src/components/profile/menus"),
      "@service": path.resolve(__dirname, "src/service"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@config": path.resolve(__dirname, "src/config"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@content": path.resolve(__dirname, "src/components/profile/content"),
      "@lists": path.resolve(__dirname, "src/components/profile/lists"),
      "@cards": path.resolve(__dirname, "src/components/profile/cards"),
      "@shared": path.resolve(__dirname, "../shared"), // if this still applies
    };
    return config;
  },

  async redirects() {
    return [
      { source: "/", destination: "/home", permanent: true },
    ];
  },
};

export default nextConfig;
