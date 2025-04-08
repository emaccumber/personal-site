/**
 * Utility function to get the correct URL for media assets
 * This handles switching between local public folder and Backblaze B2 bucket
 * @param {string} path - Path to the media file, relative to public folder
 * @returns {string} - Full URL to the media file
 */
import debug from './debug';

export function getMediaUrl(path) {
  if (!path) {
    debug.error('getMediaUrl called with empty path');
    return '';
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If NEXT_PUBLIC_MEDIA_URL is set, use it as the base URL
  // Otherwise, use relative path for local development
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';
  
  // For debugging
  debug.log(`getMediaUrl(${path}) => ${baseUrl}/${cleanPath}`);
  
  return `${baseUrl}/${cleanPath}`;
}
