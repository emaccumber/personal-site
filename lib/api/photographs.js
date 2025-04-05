import fs from 'fs';
import path from 'path';
import { photosDirectory } from './config';
import { getMediaUrl } from './media';

/**
 * Get all photo albums
 * @returns {Array} Array of photo album objects
 */
export function getAllPhotoAlbums() {
  try {
    // Read the albums JSON file
    const albumsPath = path.join(photosDirectory, 'albums.json');
    if (!fs.existsSync(albumsPath)) {
      console.error('Albums file not found:', albumsPath);
      return [];
    }

    const albumsData = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
    
    // Process cover images to use the appropriate URL
    return albumsData.albums.map(album => ({
      ...album,
      coverImage: getMediaUrl(album.coverImage)
    }));
  } catch (error) {
    console.error('Error loading photo albums:', error);
    return [];
  }
}

/**
 * Get a specific album by slug
 * @param {string} slug - The album slug
 * @returns {Object|null} The album object or null if not found
 */
export function getPhotoAlbumBySlug(slug) {
  try {
    const albumPath = path.join(photosDirectory, `${slug}.json`);
    if (!fs.existsSync(albumPath)) {
      console.error(`Album file not found for slug: ${slug}`);
      return null;
    }

    const albumData = JSON.parse(fs.readFileSync(albumPath, 'utf8'));
    
    // Process photo URLs to use the appropriate source
    return {
      ...albumData,
      photos: albumData.photos.map(photo => ({
        ...photo,
        src: getMediaUrl(photo.src)
      }))
    };
  } catch (error) {
    console.error(`Error loading album ${slug}:`, error);
    return null;
  }
}

/**
 * Get a specific photo in an album by index
 * @param {string} albumSlug - The album slug
 * @param {number} photoIndex - The photo index
 * @returns {Object|null} The photo object or null if not found
 */
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
