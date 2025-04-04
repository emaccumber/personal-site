// Configuration for external resources like Backblaze B2

// Get the base URL for media files from environment variable or use a default
const getMediaBaseUrl = () => {
  // Use environment variable in production, fallback to local path in development
  return process.env.NEXT_PUBLIC_B2_BUCKET_URL || '/images';
};

// Helper function to get the full URL for an image
export const getImageUrl = (path) => {
  // If path already starts with http or https, assume it's already a full URL
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // If path starts with a slash, remove it to avoid double slashes
  const cleanPath = path && path.startsWith('/') ? path.substring(1) : path;
  
  // If using local images (development), keep the original path format
  if (!process.env.NEXT_PUBLIC_B2_BUCKET_URL) {
    return path; // Return original path for local development
  }
  
  // For Backblaze B2, construct the full URL
  return `${getMediaBaseUrl()}/${cleanPath}`;
};

export default {
  mediaBaseUrl: getMediaBaseUrl(),
  getImageUrl
};