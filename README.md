# Personal Portfolio Site

A portfolio website showcasing photography, films, and writing, built with Next.js and MDX.

## Architecture

This site demonstrates a modern, file-based content management approach:

**📷 Photography**: JSON-driven photo albums with lightbox galleries  
**🎬 Films**: Vimeo embeds and interactive moving image albums with frame-by-frame scrubbing  
**✍️ Writing**: MDX blog posts with interactive Altair data visualizations  

### Key Features

- **Static Generation**: Fast, SEO-friendly pages built at compile time
- **Interactive Charts**: Altair/Vega-Lite visualizations embedded in blog posts
- **Smart Media Handling**: Local development files, Backblaze B2 CDN in production
- **Mobile Responsive**: Touch-friendly navigation and adaptive layouts
- **Dark Mode**: System-aware theme switching with localStorage persistence

## Development

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Serve production build locally
```

## Deployment

Automatically deploys to GitHub Pages via GitHub Actions on push to main branch.

## Content Structure

```
_content/
├── photographs/          # Photo album definitions
│   ├── albums.json      # Album metadata
│   └── [album].json     # Individual album photos
├── films/               # Film and moving image content
│   ├── films.json       # Film registry
│   └── [film].json      # Film details and clips
├── writing/             # MDX blog posts
│   └── *.mdx           # Posts with frontmatter
└── information/         # About page content
    └── about.mdx
```

## Built With AI

The majority of this codebase was developed using [Claude Code](https://claude.ai/code), Anthropic's AI coding assistant. From the initial architecture to the recent migration to MDX and GitHub Pages hosting, Claude helped design and implement the features while maintaining clean, maintainable code.