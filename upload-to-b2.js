#!/usr/bin/env node

/**
 * Script to upload files from public directory to Backblaze B2
 * 
 * Prerequisites:
 * - B2 account and bucket set up
 * - backblaze-b2 npm package installed: npm install backblaze-b2
 * - dotenv npm package installed: npm install dotenv
 * 
 * Setup:
 * 1. Create a .env.b2 file with the following environment variables:
 *    B2_APPLICATION_KEY_ID=your_application_key_id
 *    B2_APPLICATION_KEY=your_application_key
 *    B2_BUCKET_NAME=your_bucket_name
 *    
 * 2. Make this script executable: chmod +x upload-to-b2.js
 * 
 * Usage:
 * ./upload-to-b2.js [directory]
 * 
 * Example:
 * ./upload-to-b2.js public/images
 * 
 * This will upload all files from public/images to your B2 bucket,
 * maintaining the same directory structure but without the "public/" prefix.
 */

const B2 = require('backblaze-b2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.b2 file
dotenv.config({ path: '.env.b2' });

const {
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
  B2_BUCKET_NAME
} = process.env;

// Validate environment variables
if (!B2_APPLICATION_KEY_ID || !B2_APPLICATION_KEY || !B2_BUCKET_NAME) {
  console.error('Missing B2 credentials. Please check your .env.b2 file.');
  process.exit(1);
}

// Initialize B2 client
const b2 = new B2({
  applicationKeyId: B2_APPLICATION_KEY_ID,
  applicationKey: B2_APPLICATION_KEY
});

// Process command line arguments
const sourceDir = process.argv[2] || 'public';

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    // Skip .DS_Store files
    if (file === '.DS_Store') {
      continue;
    }
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to upload a file to B2
async function uploadFile(localPath, bucketId) {
  const fileName = localPath.replace(/^public\//, ''); // Remove 'public/' prefix
  const mimeType = getMimeType(localPath);
  const fileBuffer = fs.readFileSync(localPath);
  
  try {
    // Get upload URL and auth token
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: bucketId
    });
    
    // Upload the file
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: fileName,
      contentType: mimeType,
      data: fileBuffer
    });
    
    console.log(`Uploaded ${fileName} (${formatFileSize(fileBuffer.length)})`);
    return uploadResponse;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    throw error;
  }
}

// Function to determine MIME type based on file extension
function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.txt': 'text/plain'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Main function
async function main() {
  try {
    console.log('Authorizing with B2...');
    await b2.authorize();
    
    console.log('Getting bucket information...');
    const listBucketsResponse = await b2.listBuckets();
    
    const bucket = listBucketsResponse.data.buckets.find(b => b.bucketName === B2_BUCKET_NAME);
    if (!bucket) {
      console.error(`Bucket "${B2_BUCKET_NAME}" not found.`);
      process.exit(1);
    }
    
    console.log(`Found bucket "${B2_BUCKET_NAME}" (${bucket.bucketId})`);
    
    console.log(`Finding files in ${sourceDir}...`);
    const files = findFiles(sourceDir);
    console.log(`Found ${files.length} files to upload.`);
    
    // Group files by extension
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExts = ['.mp4', '.webm', '.mov'];
    
    const imageFiles = files.filter(file => imageExts.includes(path.extname(file).toLowerCase()));
    const videoFiles = files.filter(file => videoExts.includes(path.extname(file).toLowerCase()));
    const otherFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return !imageExts.includes(ext) && !videoExts.includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} images, ${videoFiles.length} videos, and ${otherFiles.length} other files.`);
    
    // Process videos for film thumbnails first
    const thumbnailVideos = videoFiles.filter(file => file.includes('/videos/films/') && path.basename(file) === 'cover.mp4');
    if (thumbnailVideos.length > 0) {
      console.log(`\nUploading ${thumbnailVideos.length} film thumbnail videos:`);
      for (let i = 0; i < thumbnailVideos.length; i++) {
        const file = thumbnailVideos[i];
        const projectName = file.split('/videos/films/')[1].split('/')[0];
        console.log(`[${i+1}/${thumbnailVideos.length}] Uploading thumbnail for "${projectName}"...`);
        await uploadFile(file, bucket.bucketId);
      }
    }
    
    // Upload remaining files
    const remainingFiles = files.filter(file => !thumbnailVideos.includes(file));
    console.log(`\nUploading ${remainingFiles.length} remaining files:`);
    for (let i = 0; i < remainingFiles.length; i++) {
      const file = remainingFiles[i];
      console.log(`[${i+1}/${remainingFiles.length}] Uploading ${file}...`);
      await uploadFile(file, bucket.bucketId);
    }
    
    console.log('\nUpload complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
