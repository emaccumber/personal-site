import B2 from 'backblaze-b2';

// Initialize B2 client
const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID,
  applicationKey: process.env.BACKBLAZE_APPLICATION_KEY
});

let authPromise = null;

// Helper to ensure we only authenticate once
const getAuthorizedB2 = async () => {
  if (!authPromise) {
    authPromise = b2.authorize();
  }
  return authPromise;
};

/**
 * Get a download URL for a file in the B2 bucket
 * 
 * @param {string} path - The file path in the bucket
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The download URL
 */
export const getFileUrl = async (path, options = {}) => {
  try {
    // Remove leading slash if present
    const filePath = path.startsWith('/') ? path.substring(1) : path;
    
    // Authenticate with B2
    const authorizedB2 = await getAuthorizedB2();
    
    // Get download URL with auth token
    const response = await b2.getDownloadAuthorization({
      bucketId: process.env.BACKBLAZE_BUCKET_ID,
      fileNamePrefix: filePath,
      validDurationInSeconds: 86400, // URL valid for 24 hours
    });
    
    // Construct the download URL
    const downloadUrl = `${authorizedB2.data.downloadUrl}/file/${process.env.BACKBLAZE_BUCKET_NAME}/${filePath}?Authorization=${response.data.authorizationToken}`;
    
    return downloadUrl;
  } catch (error) {
    console.error('Error getting B2 file URL:', error);
    // Fallback to local path if in development
    if (process.env.NODE_ENV === 'development') {
      return path;
    }
    throw error;
  }
};

/**
 * List files in a bucket with a prefix
 * 
 * @param {string} prefix - The prefix to filter files by
 * @returns {Promise<Array>} - List of files
 */
export const listFiles = async (prefix = '') => {
  try {
    // Authenticate with B2
    await getAuthorizedB2();
    
    // List files with given prefix
    const response = await b2.listFileNames({
      bucketId: process.env.BACKBLAZE_BUCKET_ID,
      prefix,
      maxFileCount: 1000,
    });
    
    return response.data.files;
  } catch (error) {
    console.error('Error listing B2 files:', error);
    return [];
  }
};

export default {
  getFileUrl,
  listFiles
};