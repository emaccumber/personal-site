# Personal Website

A minimal and fast personal website for showcasing photography, videography, and blog content.

## Features

- Photography portfolio
- Videography showcase
- Blog (future)
- Fast performance
- Simple content management using markdown and JSON files
- Mobile-responsive design with hamburger menu
- Media assets served from Backblaze B2

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment with Vercel

This site is configured for deployment with Vercel and uses Backblaze B2 for media storage.

### Setting up Backblaze B2

1. Create a Backblaze B2 account and bucket
2. Set the bucket to public
3. Configure CORS settings to allow your domain
4. Upload media files with the same directory structure as the `public` folder

### Deploying to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run the setup script: `chmod +x setup-vercel.sh && ./setup-vercel.sh`
3. Follow the prompts to link your project and set up environment variables
4. Deploy to production: `vercel --prod`

### Environment Variables

- `NEXT_PUBLIC_MEDIA_URL`: URL of your Backblaze B2 bucket (e.g., https://your-bucket.s3.us-west-000.backblazeb2.com)

## File Structure

- `/components`: React components
- `/lib`: Utility functions and API
- `/pages`: Next.js pages
- `/public`: Static assets for local development
- `/styles`: CSS modules

## Media URL Handling

All media assets are served from either:
- The local `/public` folder during development
- Your Backblaze B2 bucket in production

Media URLs are handled by the `getMediaUrl` utility function, which automatically switches between local and remote sources based on environment.

## Motion Film Thumbnails

The website features hover-to-play video thumbnails for the films section:

### How it works
1. Static images are initially displayed for faster loading
2. When a user hovers over a thumbnail, the corresponding video starts playing
3. Moving the cursor away pauses the video
4. When the video reaches its end, it stays on the final frame
5. The video will only reset when the page is reloaded

### Creating video thumbnails
1. Run `npm run create-thumbnail-dirs` to create the necessary directory structure
2. Create a short MP4 video clip (3-5 seconds recommended)
3. Name the file `cover.mp4`
4. Place it in the corresponding project folder: `/public/videos/films/[project-slug]/`
5. Ensure the video has a high-quality first frame (this will be shown before hover)
6. Upload both the static cover image and video clip to your Backblaze bucket in production

### Technical notes
- Videos should be optimized for web (low file size, H.264 codec)
- Video thumbnails are loaded lazily (only when the user first hovers)
- A fallback to static images is automatically provided for older browsers
- Videos are muted to comply with autoplay policies