/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // ⚠️ allow all external domains (Note: only for dev or trusted sources)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // matches all hostnames
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
