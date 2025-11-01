/** @type {import('next').NextConfig} */
const nextConfig = {
  // Relax ESLint during builds
  eslint: {
    // Don't fail builds on ESLint errors
    ignoreDuringBuilds: false, // Keep false but we fixed the rules
  },
  
  // TypeScript configuration
  typescript: {
    // Don't fail build on type errors during development
    // Set to false for production
    ignoreBuildErrors: false,
  },
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'collectionapi.metmuseum.org',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images for external sources
    unoptimized: true,
  },

  // Output configuration for deployment
  // output: 'standalone',
  
  // Increase timeout for static page generation
  staticPageGenerationTimeout: 180,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
