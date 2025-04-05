import path from 'path';

// Base content directory
export const contentDirectory = path.join(process.cwd(), '_content');

// Content type directories
export const photosDirectory = path.join(contentDirectory, 'photographs');
export const filmsDirectory = path.join(contentDirectory, 'films');
export const writingDirectory = path.join(contentDirectory, 'writing');
export const informationDirectory = path.join(contentDirectory, 'information');

// Media configuration
export const isProduction = process.env.NODE_ENV === 'production';
export const useRemoteMedia = process.env.USE_REMOTE_MEDIA === 'true';
export const backblazeUrl = process.env.BACKBLAZE_URL || '';
export const backblazeBucket = process.env.BACKBLAZE_BUCKET || '';

// Helper function to determine if we should use remote media
export function shouldUseRemoteMedia() {
  return isProduction && useRemoteMedia && backblazeUrl && backblazeBucket;
}
