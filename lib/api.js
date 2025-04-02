import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), '_content')
const photosDirectory = path.join(contentDirectory, 'photography')
const videosDirectory = path.join(contentDirectory, 'videography')
const postsDirectory = path.join(contentDirectory, 'blog')
const filmsDirectory = path.join(contentDirectory, 'films')
const writingDirectory = path.join(contentDirectory, 'writing')

// For photography collections
export function getAllPhotoCollections() {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  return [
    {
      slug: 'nature',
      title: 'Nature Photography',
      description: 'Landscapes and wildlife'
    },
    {
      slug: 'urban',
      title: 'Urban Photography',
      description: 'City life and architecture'
    }
  ]
}

export function getPhotoCollection(slug) {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  const collections = {
    'nature': {
      title: 'Nature Photography',
      description: 'Landscapes and wildlife',
      photos: [
        { title: 'Mountain Sunset', src: '/images/placeholder.jpg', description: 'Sunset over mountain range' },
        { title: 'Forest Path', src: '/images/placeholder.jpg', description: 'Path through ancient forest' }
      ]
    },
    'urban': {
      title: 'Urban Photography',
      description: 'City life and architecture',
      photos: [
        { title: 'City Skyline', src: '/images/placeholder.jpg', description: 'Downtown at dusk' },
        { title: 'Street Scene', src: '/images/placeholder.jpg', description: 'Busy street in the morning' }
      ]
    }
  }

  return collections[slug]
}

// For videos
export function getAllVideos() {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  return [
    {
      slug: 'documentary',
      title: 'Short Documentary',
      description: 'A day in the life'
    },
    {
      slug: 'travel',
      title: 'Travel Montage',
      description: 'Highlights from recent adventures'
    }
  ]
}

export function getVideo(slug) {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  const videos = {
    'documentary': {
      title: 'Short Documentary',
      description: 'A day in the life',
      url: 'https://example.com/video.mp4',
      thumbnail: '/images/placeholder.jpg'
    },
    'travel': {
      title: 'Travel Montage',
      description: 'Highlights from recent adventures',
      url: 'https://example.com/video.mp4',
      thumbnail: '/images/placeholder.jpg'
    }
  }

  return videos[slug]
}

// Get all photo albums
export function getAllPhotoAlbums() {
  try {
    // In a real project, we'd read the JSON file from the filesystem
    // For now, we'll import it directly
    const albums = require('../_content/photography/albums.json').albums;
    return albums;
  } catch (error) {
    console.error('Error loading photo albums:', error);
    return [];
  }
}

// Get a specific album by slug
export function getPhotoAlbumBySlug(slug) {
  try {
    // In a real project, we'd check if the file exists and read it
    // For now, we'll try to import it directly
    const album = require(`../_content/photography/${slug}.json`);
    return album;
  } catch (error) {
    console.error(`Error loading album ${slug}:`, error);
    return null;
  }
}

// Get a specific photo in an album
export function getPhotoByIndex(albumSlug, photoIndex) {
  try {
    const album = getPhotoAlbumBySlug(albumSlug);
    if (!album || !album.photos || photoIndex >= album.photos.length) {
      return null;
    }
    return album.photos[photoIndex];
  } catch (error) {
    console.error(`Error loading photo ${photoIndex} from album ${albumSlug}:`, error);
    return null;
  }
}

// Get all films
export function getAllFilms() {
  try {
    // Import films data from JSON file
    const films = require('../_content/films/films.json').films;
    return films;
  } catch (error) {
    console.error('Error loading films:', error);
    return [];
  }
}

// Get a specific film by slug
export function getFilmBySlug(slug) {
  try {
    // Import film data from JSON file
    const film = require(`../_content/films/${slug}.json`);
    return film;
  } catch (error) {
    console.error(`Error loading film ${slug}:`, error);
    return null;
  }
}

// Get all writing posts
export function getAllWritingPosts() {
  try {
    // Check if the directory exists
    if (!fs.existsSync(writingDirectory)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(writingDirectory, { recursive: true });
      // Return empty array if no posts yet
      return [];
    }

    // Get all markdown files
    const fileNames = fs.readdirSync(writingDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(writingDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse markdown front matter
        const { data, content } = matter(fileContents);

        // Return post data with slug
        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || '',
          content
        };
      });

    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);

    // For development, return placeholder data if no posts exist yet
    return [
      {
        slug: 'dead-cowboy',
        title: 'Dead Cowboy',
        date: '2/5/23',
        excerpt: 'Thoughts on the contemporary Western genre',
        content: 'This is a placeholder post about Dead Cowboy.'
      },
      {
        slug: 'form-and-pressure',
        title: 'Form and Pressure',
        date: '1/4/25',
        excerpt: 'Exploring the constraints of artistic mediums',
        content: 'This is a placeholder post about Form and Pressure.'
      },
      {
        slug: 'memorial-for-john-szarkowski',
        title: 'Memorial for John Szarkowski',
        date: '12/23/24',
        excerpt: 'Remembering the influential photography curator',
        content: 'This is a placeholder post about Memorial for John Szarkowski.'
      },
      {
        slug: 'the-fractal-geometry-of-experience',
        title: 'The Fractal Geometry of Experience',
        date: '11/5/24',
        excerpt: 'Patterns of perception across scales of consciousness',
        content: 'This is a placeholder post about The Fractal Geometry of Experience.'
      }
    ];
  }
}

// Get a specific writing post by slug
export function getWritingPostBySlug(slug) {
  try {
    // Create content directory if it doesn't exist
    if (!fs.existsSync(writingDirectory)) {
      fs.mkdirSync(writingDirectory, { recursive: true });
    }

    const fullPath = path.join(writingDirectory, `${slug}.md`);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      // For development, return placeholder data
      const post = {
        slug,
        title: slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        date: new Date().toLocaleDateString(),
        content: `This is a placeholder post for ${slug}.`,
        contentHtml: `<p>This is a placeholder post for ${slug}.</p>`
      };

      // Look for the post in the placeholder data
      const placeholderPosts = getAllWritingPosts();
      const placeholderPost = placeholderPosts.find(p => p.slug === slug);

      if (placeholderPost) {
        post.title = placeholderPost.title;
        post.date = placeholderPost.date;
        post.content = placeholderPost.content;
        post.contentHtml = `<p>${placeholderPost.content}</p>`;
      }

      return post;
    }

    // Read markdown file
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse markdown front matter and content
    const { data, content } = matter(fileContents);

    // Process markdown content to HTML
    const processedContent = remark()
      .use(html)
      .processSync(content)
      .toString();

    // Return post data with HTML content
    return {
      slug,
      title: data.title,
      date: data.date,
      content,
      contentHtml: processedContent
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);

    // Return null if unable to load the post
    return null;
  }
}