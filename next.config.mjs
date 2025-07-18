/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Add pattern for Backblaze B2 or Cloudflare CDN
      ...(process.env.NEXT_PUBLIC_MEDIA_URL 
        ? [{
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname,
          }]
        : [])
    ],
  },
  // Enable static exports for GitHub Pages
  output: 'export',
  trailingSlash: true,
  // Configure base path for GitHub Pages repository hosting
  basePath: process.env.NODE_ENV === 'production' ? '/personal-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/personal-site/' : '',
}

export default nextConfig