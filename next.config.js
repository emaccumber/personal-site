/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'f004.backblazeb2.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        port: '',
        pathname: '/file/**',
      },
    ],
  },
  // Enable static exports for Vercel deployment
  output: 'standalone',
}

module.exports = nextConfig