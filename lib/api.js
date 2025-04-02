import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), '_content')
const photosDirectory = path.join(contentDirectory, 'photography')
const videosDirectory = path.join(contentDirectory, 'videography')
const postsDirectory = path.join(contentDirectory, 'blog')

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

// For blog posts
export function getAllPosts() {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  return [
    {
      slug: 'first-post',
      title: 'My First Blog Post',
      date: '2023-01-01',
      excerpt: 'This is my first blog post...'
    },
    {
      slug: 'photography-tips',
      title: 'Photography Tips for Beginners',
      date: '2023-01-15',
      excerpt: 'Here are some photography tips I wish I knew when starting out...'
    }
  ]
}

export function getPostBySlug(slug) {
  // This is a placeholder - in a real project we'd read from the filesystem
  // For now, returning mock data
  const posts = {
    'first-post': {
      title: 'My First Blog Post',
      date: '2023-01-01',
      content: 'This is my first blog post. Welcome to my website!'
    },
    'photography-tips': {
      title: 'Photography Tips for Beginners',
      date: '2023-01-15',
      content: 'Here are some photography tips I wish I knew when starting out...'
    }
  }
  
  return posts[slug]
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