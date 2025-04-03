import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared": path.resolve(__dirname, "../shared"), // Map @shared to the shared folder
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/concerts",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/discovery",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/social",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/profile/reports",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/profile/trends",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/profile/breakdown",
        destination: "/under-construction",
        permanent: false,
      },
      {
        source: "/profile/obscurity",
        destination: "/under-construction",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;