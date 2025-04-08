#!/usr/bin/env node

/**
 * Script to verify video thumbnail files
 * 
 * This script checks that cover.mp4 files exist for each film
 * and validates that they are proper MP4 files.
 * 
 * Usage:
 * node verify-videos.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path constants
const CONTENT_DIR = path.join(process.cwd(), '_content');
const FILMS_JSON_PATH = path.join(CONTENT_DIR, 'films', 'films.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos', 'films');

// Function to check if a file is a valid video
function isValidVideo(filePath) {
  try {
    // Try to get file info using ffprobe if available
    try {
      execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
      return true;
    } catch (e) {
      // If ffprobe not available, just check file size and magic numbers
      const fileSize = fs.statSync(filePath).size;
      
      // Video files should be at least a few KB
      if (fileSize < 1000) {
        console.warn(`  Warning: ${filePath} is very small (${fileSize} bytes)`);
      }
      
      // Read the first 8 bytes to check for MP4 file signature
      const buffer = Buffer.alloc(8);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 8, 0);
      fs.closeSync(fd);
      
      // Common MP4 headers
      const isMP4 = buffer.toString('hex', 4, 8) === '66747970'; // 'ftyp'
      
      if (!isMP4) {
        console.warn(`  Warning: ${filePath} does not appear to be a valid MP4 file`);
      }
      
      return fileSize > 1000;
    }
  } catch (error) {
    console.error(`  Error checking ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('Verifying video thumbnail files...\n');
  
  // First check if the videos directory exists
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error(`Error: Videos directory does not exist at ${VIDEOS_DIR}`);
    console.log(`Creating directory structure: ${VIDEOS_DIR}`);
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(FILMS_JSON_PATH)) {
    console.error(`Error: films.json not found at ${FILMS_JSON_PATH}`);
    process.exit(1);
  }
  
  try {
    // Read and parse films.json
    const filmsData = JSON.parse(fs.readFileSync(FILMS_JSON_PATH, 'utf8'));
    
    if (!filmsData.films || !Array.isArray(filmsData.films)) {
      console.error('Error: Invalid films.json structure (films array not found)');
      process.exit(1);
    }
    
    const films = filmsData.films;
    console.log(`Found ${films.length} films in films.json\n`);
    
    // Check video files for each film
    let validCount = 0;
    let missingCount = 0;
    let invalidCount = 0;
    
    console.log('Checking video thumbnails:');
    console.log('-------------------------');
    
    for (const film of films) {
      if (!film.slug) {
        console.warn('Warning: Film without slug found, skipping...');
        continue;
      }
      
      // Process all film types - both regular films and moving image albums
      const dirSlug = film.slug.replace(/^moving-image-/, '');
      
      const filmDir = path.join(VIDEOS_DIR, dirSlug);
      const videoPath = path.join(filmDir, 'cover.mp4');
      
      console.log(`Film: ${film.title} (${film.slug})`);
      console.log(`  Type: ${film.type || 'regular film'}`);
      console.log(`  Looking in directory: ${filmDir}`);
      console.log(`  Video path: ${videoPath}`);
      
      // Check if directory exists
      if (!fs.existsSync(filmDir)) {
        console.log(`  ❌ Directory does not exist: ${filmDir}`);
        console.log(`  Creating directory: ${filmDir}`);
        fs.mkdirSync(filmDir, { recursive: true });
        missingCount++;
        continue;
      }
      
      // Check if cover.mp4 exists
      if (!fs.existsSync(videoPath)) {
        console.log(`  ❌ Video not found: ${videoPath}`);
        missingCount++;
        continue;
      }
      
      // Validate the video file
      if (isValidVideo(videoPath)) {
        const stats = fs.statSync(videoPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`  ✅ Valid video found: ${videoPath} (${fileSizeMB} MB)`);
        validCount++;
      } else {
        console.log(`  ⚠️ Invalid video found: ${videoPath}`);
        invalidCount++;
      }
      
      console.log(''); // Empty line between films
    }
    
    // Summary
    console.log('\nSummary:');
    console.log('-------');
    console.log(`Total films: ${films.length}`);
    console.log(`Valid videos: ${validCount}`);
    console.log(`Missing videos: ${missingCount}`);
    console.log(`Invalid videos: ${invalidCount}`);
    
    // Check the actual filesystem structure
    console.log('\nChecking actual filesystem structure:');
    if (fs.existsSync(VIDEOS_DIR)) {
      const dirs = fs.readdirSync(VIDEOS_DIR);
      console.log(`Directories in ${VIDEOS_DIR}:`);
      for (const dir of dirs) {
        const fullPath = path.join(VIDEOS_DIR, dir);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        if (isDirectory) {
          console.log(`  - ${dir}/`);
          // List files in this directory
          const files = fs.readdirSync(fullPath);
          for (const file of files) {
            const filePath = path.join(fullPath, file);
            const stats = fs.statSync(filePath);
            console.log(`    - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
          }
        } else {
          console.log(`  - ${dir}`);
        }
      }
    } else {
      console.log(`Directory does not exist: ${VIDEOS_DIR}`);
    }
    
    // Provide next steps
    if (missingCount > 0 || invalidCount > 0) {
      console.log('\nNext steps:');
      console.log('----------');
      console.log('1. Ensure all video files exist at path: /public/videos/films/[film-slug]/cover.mp4');
      console.log('2. Verify video files are valid MP4 format');
      console.log('3. Run this script again to check');
    } else if (validCount > 0) {
      console.log('\nAll video thumbnails are valid! 🎉');
    } else {
      console.log('\nNo valid video thumbnails found. Please add some videos.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();