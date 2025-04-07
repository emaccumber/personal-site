/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Extract the domain from the NEXT_PUBLIC_MEDIA_URL if set
      ...(process.env.NEXT_PUBLIC_MEDIA_URL 
        ? [new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname] 
        : [])
    ],
  },
  // Enable static exports for better performance
  output: 'standalone',
}

module.exports = nextConfig