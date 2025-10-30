/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization entirely
  output: 'standalone',
  
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
      },
    ],
    unoptimized: true,
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Increase timeout
  staticPageGenerationTimeout: 180,
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
