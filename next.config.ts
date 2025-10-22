import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Force ethers.js and related packages to use Node.js versions instead of browser versions
      config.resolve.alias = {
        ...config.resolve.alias,
        '@ethersproject/providers': require.resolve('@ethersproject/providers'),
        '@ethersproject/web': require.resolve('@ethersproject/web'),
        'alchemy-sdk': require.resolve('alchemy-sdk'),
      };

      // Ensure fetch polyfill is available for server-side ethers.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Handle externals for server-side packages
    if (isServer) {
      config.externals.push({
        'node:crypto': 'crypto',
        'node:fs': 'fs',
        'node:path': 'path',
      });
    }

    return config;
  },
};

export default nextConfig;