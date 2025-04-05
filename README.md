# Personal Website

A minimal and fast personal website for showcasing photography, videography, and blog content. Deployed on Vercel with media hosted on Backblaze B2.

## Features

- Photography portfolio
- Videography showcase
- Blog (future)
- Fast performance
- Simple content management using markdown and JSON files
- Vercel deployment
- Backblaze B2 media hosting

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the following variables:
   ```
   # Backblaze B2 Configuration
   NEXT_PUBLIC_B2_BUCKET_URL=https://f004.backblazeb2.com/file/your-bucket-name

   # Environment mode - set to true for local development
   NEXT_PUBLIC_USE_LOCAL_MEDIA=true
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backblaze B2 Setup

1. Create a Backblaze B2 account at [backblaze.com](https://www.backblaze.com/)
2. Create a new bucket with public access
3. Note your bucket name and endpoint URL
4. Upload your media files to Backblaze B2, maintaining the same directory structure as in your local `/public` directory:
   - `/images/photographs/album-name/photo.jpg`
   - `/videos/films/film-name/clip.mp4`
   - etc.

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_B2_BUCKET_URL`: Your Backblaze B2 bucket URL (e.g., `https://f004.backblazeb2.com/file/your-bucket-name`)
   - `NEXT_PUBLIC_USE_LOCAL_MEDIA`: Set to `false` for production
4. Deploy your site

## Media Structure

The site expects media files to be organized in the following structure:

```
/images
  /photographs
    /album-name
      1.jpg
      2.jpg
      ...
      cover.jpg
  /featured.jpg

/videos
  /films
    /film-name
      clip1.mp4
      clip2.mp4
      ...
```

## Development Notes

- In development mode, media files are served from the local `/public` directory
- In production, media files are served from Backblaze B2
- You can toggle between local and remote media by changing the `NEXT_PUBLIC_USE_LOCAL_MEDIA` environment variable
