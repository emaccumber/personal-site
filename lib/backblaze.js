/**
 * Backblaze B2 integration utilities
 *
 * This file provides utilities for working with media files stored in Backblaze B2
 */

// Get the Backblaze B2 bucket URL from environment variables
const B2_BUCKET_URL = process.env.NEXT_PUBLIC_B2_BUCKET_URL;

// Check if we should use local media (for development)
const USE_LOCAL_MEDIA = process.env.NEXT_PUBLIC_USE_LOCAL_MEDIA === 'true';

// Log configuration on startup
console.log('Backblaze configuration:');
console.log('- B2_BUCKET_URL:', B2_BUCKET_URL);
console.log('- USE_LOCAL_MEDIA:', USE_LOCAL_MEDIA);
console.log('- NODE_ENV:', process.env.NODE_ENV);

/**
 * Determines if we should use local media files instead of Backblaze
 *
 * @returns {boolean} - True if we should use local media
 */
export function shouldUseLocalMedia() {
  return USE_LOCAL_MEDIA || process.env.NODE_ENV === 'development';
}

/**
 * Converts a local media path to a Backblaze B2 URL
 *
 * @param {string} localPath - The local path (e.g., "/images/photographs/album/photo.jpg")
 * @returns {string} - The Backblaze B2 URL or local path depending on environment
 */
export function getB2Url(localPath) {
  // Handle null or undefined paths
  if (!localPath) {
    console.warn('getB2Url called with null or undefined path');
    return '';
  }

  // If path is already a full URL, return it as is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath;
  }

  // If we're in development or USE_LOCAL_MEDIA is true, use the local path
  if (shouldUseLocalMedia()) {
    return localPath;
  }

  // If no B2 URL is configured, use the local path
  if (!B2_BUCKET_URL) {
    console.warn('Backblaze B2 bucket URL not configured. Using local path:', localPath);
    return localPath;
  }

  try {
    // Remove the leading slash if present
    const cleanPath = localPath.startsWith('/') ? localPath.substring(1) : localPath;

    // Combine the B2 bucket URL with the clean path
    const fullUrl = `${B2_BUCKET_URL}/${cleanPath}`;

    // Log the first few URLs for debugging
    if (typeof window !== 'undefined') {
      if (!window._logCount) window._logCount = 0;
      if (window._logCount < 5) {
        console.log(`Backblaze URL (${window._logCount + 1}/5):`, fullUrl);
        window._logCount++;
      }
    }

    return fullUrl;
  } catch (error) {
    console.error('Error generating Backblaze URL:', error);
    return localPath; // Fall back to local path on error
  }
}

/**
 * Determines if a URL is a Backblaze B2 URL
 *
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is a Backblaze B2 URL
 */
export function isB2Url(url) {
  return url && B2_BUCKET_URL && url.startsWith(B2_BUCKET_URL);
}

/**
 * Gets the appropriate image URL based on the environment
 * In production, uses Backblaze B2
 * In development, uses local files
 *
 * @param {string} path - The image path
 * @returns {string} - The appropriate URL for the current environment
 */
export function getImageUrl(path) {
  return getB2Url(path);
}

/**
 * Gets the appropriate video URL based on the environment
 * In production, uses Backblaze B2
 * In development, uses local files
 *
 * @param {string} path - The video path
 * @returns {string} - The appropriate URL for the current environment
 */
export function getVideoUrl(path) {
  return getB2Url(path);
}

/**
 * Gets the appropriate cover image URL for albums or films
 *
 * @param {string} path - The cover image path
 * @returns {string} - The appropriate URL for the current environment
 */
export function getCoverImageUrl(path) {
  return getImageUrl(path);
}
