import { getMediaUrl } from './mediaUrl';

/**
 * Get the URL for a film's cover video
 * 
 * @param {string} filmSlug - The slug of the film
 * @param {string} coverVideo - Optional explicit video path
 * @returns {string} - The full URL to the cover video
 */
export function getFilmCoverVideoUrl(filmSlug, coverVideo) {
  // If coverVideo is provided, use it directly
  if (coverVideo) {
    return coverVideo;
  }
  
  // Otherwise, use the default path
  // Remove 'moving-image-' prefix if present for path construction
  const cleanSlug = filmSlug.replace(/^moving-image-/, '');
  
  // Correctly reference videos from public folder
  return `/videos/films/${cleanSlug}/cover.mp4`;
}
