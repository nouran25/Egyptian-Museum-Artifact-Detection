/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
        pathname: '/**',
      },
    ],
  },

  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
  
  // Use standalone output for better compatibility
  output: 'standalone',
};

module.exports = nextConfig;
