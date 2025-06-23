import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import gfm from 'remark-gfm'
import directive from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

// Use absolute paths for better debugging
const contentDirectory = path.join(process.cwd(), '_content')
console.log('Content directory path:', contentDirectory)

const photosDirectory = path.join(contentDirectory, 'photographs')
const videosDirectory = path.join(contentDirectory, 'videography')
const postsDirectory = path.join(contentDirectory, 'blog')
const filmsDirectory = path.join(contentDirectory, 'films')
const writingDirectory = path.join(contentDirectory, 'writing')
const informationDirectory = path.join(contentDirectory, 'information')

// Log information directory for debugging
console.log('Information directory path:', informationDirectory)

// Remark plugin to handle Altair chart directives
function altairDirective() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'altair') return

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}
        
        // Get chart spec from node content or attributes
        let content = ''
        
        if (attributes.src) {
          // Load from external file (not implemented yet)
          console.log('External file loading not implemented')
          return
        } else if (node.children && node.children.length > 0) {
          // Get spec from content - handle all types of children
          content = node.children
            .map((child: any) => {
              if (child.type === 'code') {
                return child.value
              } else if (child.type === 'text') {
                return child.value
              } else if (child.type === 'paragraph' && child.children) {
                return child.children
                  .map((grandchild: any) => grandchild.value || '')
                  .join('')
              }
              return ''
            })
            .join('')
            .trim()
          
          if (content) {
            try {
              // Validate JSON
              const parsedSpec = JSON.parse(content)
              
              // Escape the JSON content for HTML attribute
              const escapedContent = content
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
              
              data.hName = 'div'
              data.hProperties = {
                className: 'altair-chart',
                'data-altair': 'true',
                'data-altair-spec': escapedContent,
                ...(attributes.width && { 'data-width': attributes.width }),
                ...(attributes.height && { 'data-height': attributes.height })
              }
              
              // Replace children with a placeholder
              node.children = [{
                type: 'text',
                value: 'Loading chart...'
              }]
              
            } catch (error) {
              console.error('Invalid Altair chart JSON:', error)
              console.error('Content was:', content)
              return
            }
          }
        }

        if (!content) {
          console.error('Altair directive missing chart specification')
          return
        }
      }
    })
  }
}

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
    const albums = require('../_content/photographs/albums.json').albums;
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
    const album = require(`../_content/photographs/${slug}.json`);
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

// Get all films (including moving image albums)
export function getAllFilms() {
  try {
    // Import films data from JSON file
    const films = require('../_content/films/films.json').films;
    console.log("Original films data:", JSON.stringify(films, null, 2));

    // Return all films, but mark moving image albums for special handling in UI
    return films.map(film => {
      if (film.type === 'moving-image-album') {
        return {
          ...film,
          isMovingImageAlbum: true,
          // Ensure the slug is properly formatted for routing
          slug: `moving-image-${film.slug}`
        };
      }
      return film;
    });
  } catch (error) {
    console.error('Error loading films:', error);
    return [];
  }
}

// Get all moving image albums (for dedicated moving images page if needed)
export function getAllMovingImageAlbums() {
  try {
    // Get moving image albums from films.json
    const allFilms = require('../_content/films/films.json').films;
    return allFilms
      .filter(film => film.type === 'moving-image-album')
      .map(film => ({
        ...film,
        isMovingImageAlbum: true,
        slug: `moving-image-${film.slug}`
      }));
  } catch (error) {
    console.error('Error loading moving image albums:', error);
    return [];
  }
}

// Get a specific film by slug
export function getFilmBySlug(slug) {
  try {
    // Check if this is a moving image album
    if (slug.startsWith('moving-image-')) {
      const albumSlug = slug.replace('moving-image-', '');
      const album = getMovingImageAlbumBySlug(albumSlug);
      if (album) {
        return {
          ...album,
          type: 'moving-image-album',
          originalSlug: albumSlug
        };
      }
    }

    // Otherwise, import film data from JSON file
    const film = require(`../_content/films/${slug}.json`);
    return film;
  } catch (error) {
    console.error(`Error loading film ${slug}:`, error);
    return null;
  }
}

// Get a specific moving image album by slug
export function getMovingImageAlbumBySlug(slug) {
  try {
    // Read from the JSON file in _content/films
    const fullPath = path.join(filmsDirectory, `${slug}.json`);
    
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      // Read and parse the JSON file
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const album = JSON.parse(fileContents);
      return album;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading moving image album ${slug}:`, error);
    return null;
  }
}

// Get a specific clip in an album
export function getClipByIndex(albumSlug, clipIndex) {
  try {
    const album = getMovingImageAlbumBySlug(albumSlug);
    if (!album || !album.clips || clipIndex >= album.clips.length) {
      return null;
    }
    return album.clips[clipIndex];
  } catch (error) {
    console.error(`Error loading clip ${clipIndex} from album ${albumSlug}:`, error);
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

    // Process markdown content to HTML with GFM support (tables, etc.)
    const processedContent = remark()
      .use(gfm)
      .use(directive)
      .use(altairDirective)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
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

// Get information page content
export function getInformationContent() {
  try {
    console.log('getInformationContent called');

    // Create information directory if it doesn't exist
    if (!fs.existsSync(informationDirectory)) {
      console.log('Creating information directory at:', informationDirectory);
      fs.mkdirSync(informationDirectory, { recursive: true });
    }

    const filePath = path.join(informationDirectory, 'about.md');
    console.log('Looking for information file at:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log('Information file not found at path:', filePath);
      // Return default content if the file doesn't exist
      return {
        title: 'About Ethan MacCumber',
        content: 'Information page content not found.',
        contentHtml: '<p>Information page content not found.</p>'
      };
    }

    console.log('Reading information file from:', filePath);
    // Read markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('File contents read successfully, length:', fileContents.length);

    // Parse markdown front matter and content
    const { data, content } = matter(fileContents);
    console.log('Front matter data:', data);

    // Process markdown content to HTML with GFM support (tables, etc.)
    const processedContent = remark()
      .use(gfm)
      .use(directive)
      .use(altairDirective)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .processSync(content)
      .toString();

    console.log('HTML content generated, length:', processedContent.length);

    // Return the information content
    return {
      title: data.title || 'About Ethan MacCumber',
      content,
      contentHtml: processedContent
    };
  } catch (error) {
    console.error('Error loading information content:', error);
    console.error(error.stack);

    // Return default content in case of error
    return {
      title: 'About Ethan MacCumber',
      content: 'Error loading information content.',
      contentHtml: '<p>Error loading information content.</p>'
    };
  }
}