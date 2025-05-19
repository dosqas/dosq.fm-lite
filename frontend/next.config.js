const path = require('path');

const nextConfig = {
  reactStrictMode: false,

  env: {
    NEXT_PUBLIC_SERVER_URL: 'dosqfm-lite-production.up.railway.app',
  },

  webpack: (config) => {
    const rootPath = process.cwd();

    config.resolve.alias = {
      ...config.resolve.alias,
      "@src": path.join(rootPath, "src"),
      "@styles": path.join(rootPath, "src/styles"),
      "@components": path.join(rootPath, "src/components"),
      "@utils": path.join(rootPath, "src/utils"),
      "@context": path.join(rootPath, "src/context"),
      "@menus": path.join(rootPath, "src/components/profile/menus"),
      "@service": path.join(rootPath, "src/service"),
      "@entities": path.join(rootPath, "src/entities"),
      "@config": path.join(rootPath, "src/config"),
      "@hooks": path.join(rootPath, "src/hooks"),
      "@content": path.join(rootPath, "src/components/profile/content"),
      "@lists": path.join(rootPath, "src/components/profile/lists"),
      "@cards": path.join(rootPath, "src/components/profile/cards"),
    };
    return config;
  },

  async redirects() {
    return [
      { source: "/", destination: "/home", permanent: true },
    ];
  },
};

module.exports = nextConfig;
