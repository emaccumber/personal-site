/**
 * Get the appropriate URL for a media file based on environment configuration
 * @param {string} localPath - The local path to the media file (e.g., /images/photo.jpg)
 * @returns {string} - The URL to use for the media file
 */
export function getMediaUrl(localPath) {
  // Get environment variables directly from next.config.js env
  const useRemoteMedia = process.env.USE_REMOTE_MEDIA === 'true';
  const backblazeUrl = process.env.BACKBLAZE_URL || '';
  const backblazeBucket = process.env.BACKBLAZE_BUCKET || '';

  // If we're not using remote media or missing config, return the local path
  if (!useRemoteMedia || !backblazeUrl || !backblazeBucket) {
    return localPath;
  }

  // Remove leading slash if present
  const cleanPath = localPath.startsWith('/') ? localPath.substring(1) : localPath;

  // Construct the remote URL
  return `${backblazeUrl}/${backblazeBucket}/${cleanPath}`;
}
