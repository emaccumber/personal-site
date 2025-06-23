# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Next.js for showcasing photography, films, and writing. The site uses static generation with JSON/Markdown content files and external media hosting via Backblaze B2.

## Key Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm run start        # Start production server

# Deployment
npm run deploy       # Deploy to Vercel (requires vercel CLI)
./setup-vercel.sh    # Initial Vercel setup (run once)

# Utilities
npm run clean        # Remove .next directory and other build artifacts
npm run upload-media # Upload media files to Backblaze B2 bucket
```

## Architecture & Code Structure

### Content Management System
- **Static Data**: JSON files in `_content/` directory
  - `photographs/albums.json` - Photography albums metadata
  - `films/` - Video content metadata
  - `information/` - About page content
  - `writing/` - Blog posts in Markdown format

### Media Strategy
- Development: Media served from `/public` directory
- Production: Media served from Backblaze B2 via CDN
- Media URLs handled by `lib/media.js` - `getMediaUrl()` function
- Environment variable: `NEXT_PUBLIC_MEDIA_URL` (B2 bucket URL)

### Key Patterns
- **Page Structure**: Pages use `getStaticProps` for data fetching
- **Dynamic Routes**: 
  - `/photographs/[album]` - Individual photo albums
  - `/writing/[slug]` - Blog posts
- **Component Conventions**: Mix of JavaScript and TypeScript components in `/components`
- **Styling**: CSS Modules with component-specific styles
- **Dark Mode**: Implemented with CSS variables and localStorage persistence

### Type Definitions
Main types are defined in `types/index.ts`:
- `Photo`, `PhotoAlbum` - Photography content
- `Film`, `Clip` - Video content with Vimeo integration  
- `WritingPost` - Blog posts
- `InformationContent` - About page

### Content Updates
When adding new content:
1. Photography: Add album to `_content/photographs/albums.json` and photos to `_content/photographs/[album-id].json`
2. Films: Add to appropriate JSON file in `_content/films/`
3. Writing: Add Markdown file to `_content/writing/`
4. Media files: Upload to Backblaze B2 maintaining the same directory structure as `/public`

### TypeScript Configuration
- Mixed JS/TS codebase with `allowJs: true`
- Path alias `@/*` maps to root directory
- Strict mode disabled (`strict: false`)

## Important Notes

- The project uses Next.js 14.2.26 with React 18.2.0
- No testing framework or linting is currently configured
- Mobile responsive with hamburger menu navigation
- Error boundaries implemented for graceful error handling
- Always test dark mode toggle functionality after UI changes