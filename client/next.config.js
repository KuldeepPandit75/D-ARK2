/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    images: {
        domains: ['ipfs.io', 'gateway.pinata.cloud'],
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                pathname: '/ipfs/**',
            },
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
                pathname: '/ipfs/**',
            }
        ],
    },
    webpack: (config, { isServer }) => {
        config.resolve.fallback = { 
            fs: false, 
            net: false, 
            tls: false 
        };

        config.resolve.alias = {
            ...config.resolve.alias,
            '@dark': path.resolve(__dirname, '../D-ARK/frontend/src')
        };

        return config;
    },
    experimental: {
        externalDir: true
    },
    // Add this to handle client-side routing
    async rewrites() {
        return [
            {
                source: '/virtual-verse/:path*',
                destination: '/virtual-verse',
            },
        ];
    }
};

module.exports = nextConfig;
