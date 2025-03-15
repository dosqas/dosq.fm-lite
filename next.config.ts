import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/concerts',
        destination: '/under-construction',
        permanent: false,
      },
      {
        source: '/discovery',
        destination: '/under-construction',
        permanent: false,
      },
      {
        source: '/social',
        destination: '/under-construction',
        permanent: false,
      },
      {
        source: '/profile',
        destination: '/under-construction',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
