/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '**',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '**',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      debug: false, // ignore debug module
    };
    return config;
  },
};

module.exports = nextConfig;
