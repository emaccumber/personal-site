# Ethan MacCumber's Personal Site

A portfolio website built with Next.js showcasing photographs, films, and writings.

## Deployment Setup Instructions

### Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Backblaze B2 account (https://www.backblaze.com/b2/cloud-storage.html)
- Domain registered with Namecheap (ethanmaccumber.com)

### Setting Up Backblaze B2

1. Create a Backblaze B2 account if you don't already have one
2. Create a new bucket (e.g., "ethanmaccumber-media")
3. Make the bucket private for better security
4. Create an application key with read access to this bucket
5. Note your bucket name, bucket ID, application key ID, and application key
6. Upload your media files to the bucket (images, videos, etc.) maintaining the same folder structure as in your public directory

### Setting Up Vercel

1. Push your project to a GitHub repository
2. Create an account on Vercel and connect it to your GitHub account
3. Import your repository to Vercel
4. Configure Environment Variables in the Vercel dashboard:
   - `BACKBLAZE_APPLICATION_KEY_ID`: Your Backblaze application key ID
   - `BACKBLAZE_APPLICATION_KEY`: Your Backblaze application key
   - `BACKBLAZE_BUCKET_NAME`: Your bucket name
   - `BACKBLAZE_BUCKET_ID`: Your bucket ID
5. Deploy

### Setting Up Custom Domain

1. In the Vercel dashboard, go to your project settings
2. Navigate to the "Domains" section
3. Add your domain: ethanmaccumber.com
4. Follow Vercel's instructions to update your DNS settings at Namecheap:
   - Add a CNAME record pointing to cname.vercel-dns.com
   - Add TXT records for domain verification

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Environment Variables

Copy `.env.local` to your local environment and update the values:

```
BACKBLAZE_APPLICATION_KEY_ID=your_application_key_id
BACKBLAZE_APPLICATION_KEY=your_application_key
BACKBLAZE_BUCKET_NAME=your_bucket_name
BACKBLAZE_BUCKET_ID=your_bucket_id
```

### Project Structure

- `/pages` - Next.js pages
- `/components` - React components
- `/styles` - CSS modules
- `/public` - Static assets (for development)
- `/_content` - Content data (JSON files, markdown, etc.)
- `/lib` - Utility functions and API

## Content Management

Content is stored in the `_content` directory, organized by type:

- `/_content/photographs` - Photo albums and metadata
- `/_content/films` - Film and video information
- `/_content/writing` - Blog posts and articles
