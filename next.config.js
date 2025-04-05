/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'f004.backblazeb2.com', // Backblaze B2 domain
      process.env.BACKBLAZE_DOMAIN // Allow configurable domain
    ].filter(Boolean), // Filter out undefined values
  },
  // Environment variables that will be available at build time
  env: {
    USE_REMOTE_MEDIA: process.env.USE_REMOTE_MEDIA,
    BACKBLAZE_URL: process.env.BACKBLAZE_URL,
    BACKBLAZE_BUCKET: process.env.BACKBLAZE_BUCKET
  },
  // Handle Node.js modules that should only run on the server
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        path: false,
      }
    }
    return config
  },
}

module.exports = nextConfig