// Configuration for external resources like Backblaze B2

// Get the base URL for media files
const getMediaBaseUrl = () => {
  // In production, use our API route
  if (process.env.NODE_ENV === 'production') {
    return '/api/media';
  }
  // In development, use local files
  return '/images';
};

// Helper function to get the full URL for an image
export const getImageUrl = (path) => {
  // If path already starts with http or https, assume it's already a full URL
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // If path starts with a slash, remove it to avoid double slashes
  const cleanPath = path && path.startsWith('/') ? path.substring(1) : path;
  
  // Construct the appropriate path based on environment
  const baseUrl = getMediaBaseUrl();
  return `${baseUrl}/${cleanPath}`;
};

export default {
  mediaBaseUrl: getMediaBaseUrl(),
  getImageUrl
};