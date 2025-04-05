/**
 * Backblaze B2 Upload Script
 * 
 * This script helps upload files from your local public directory to Backblaze B2.
 * 
 * Usage:
 * 1. Set up your Backblaze B2 credentials in .env.local
 * 2. Run: node scripts/upload-to-backblaze.js
 */

require('dotenv').config({ path: '.env.local' });
const B2 = require('backblaze-b2');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Backblaze B2 credentials
const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'ethan-site-media';

// Initialize B2 client
const b2 = new B2({
  applicationKeyId: B2_APPLICATION_KEY_ID,
  applicationKey: B2_APPLICATION_KEY
});

// Source directory (local files)
const PUBLIC_DIR = path.join(__dirname, '../public');

// Function to recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Function to upload a file to B2
async function uploadFile(localPath, b2Path) {
  try {
    const fileData = fs.readFileSync(localPath);
    const uploadUrl = await b2.getUploadUrl({
      bucketId: B2_BUCKET_NAME
    });

    console.log(`Uploading ${localPath} to ${b2Path}...`);
    
    const response = await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: b2Path,
      data: fileData
    });

    console.log(`Successfully uploaded ${localPath} to ${b2Path}`);
    return response;
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Authorizing with Backblaze B2...');
    await b2.authorize();
    console.log('Authorization successful');

    console.log(`Getting files from ${PUBLIC_DIR}...`);
    const files = await getFiles(PUBLIC_DIR);
    console.log(`Found ${files.length} files`);

    for (const file of files) {
      // Skip .DS_Store and other hidden files
      if (path.basename(file).startsWith('.')) {
        continue;
      }

      // Calculate B2 path (relative to public directory)
      const relativePath = path.relative(PUBLIC_DIR, file);
      const b2Path = relativePath.replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

      await uploadFile(file, b2Path);
    }

    console.log('Upload complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
