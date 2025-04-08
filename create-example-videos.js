#!/usr/bin/env node

/**
 * Script to create example cover.mp4 files for all film entries
 * 
 * This will create empty MP4 files with the correct headers so that
 * the video thumbnails will work as expected for testing.
 * 
 * Usage:
 * node create-example-videos.js
 */

const fs = require('fs');
const path = require('path');

// Path constants
const CONTENT_DIR = path.join(process.cwd(), '_content');
const FILMS_JSON_PATH = path.join(CONTENT_DIR, 'films', 'films.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos', 'films');

// Sample MP4 header bytes (minimal valid MP4)
const MP4_HEADER = Buffer.from([
  // ftyp box
  0x00, 0x00, 0x00, 0x18, // size: 24 bytes
  0x66, 0x74, 0x79, 0x70, // type: 'ftyp'
  0x69, 0x73, 0x6F, 0x6D, // major_brand: 'isom'
  0x00, 0x00, 0x00, 0x01, // minor_version: 1
  0x69, 0x73, 0x6F, 0x6D, // compatible_brands: 'isom'
  0x61, 0x76, 0x63, 0x31, // compatible_brands: 'avc1'
  
  // minimal moov box (simplified - not a fully valid MP4 but enough for testing)
  0x00, 0x00, 0x00, 0x10, // size: 16 bytes
  0x6D, 0x6F, 0x6F, 0x76, // type: 'moov'
  0x00, 0x00, 0x00, 0x00, // placeholder data
  0x00, 0x00, 0x00, 0x00  // placeholder data
]);

// Main function
async function main() {
  console.log('Creating example video thumbnails...\n');
  
  // First check if the videos directory exists
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.log(`Creating videos directory: ${VIDEOS_DIR}`);
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
    
    // Create example videos for each film
    let createdCount = 0;
    let skippedCount = 0;
    
    console.log('Creating example videos:');
    console.log('----------------------');
    
    for (const film of films) {
      if (!film.slug) {
        console.warn('Warning: Film without slug found, skipping...');
        continue;
      }
      
      // Process all film types
      const dirSlug = film.slug.replace(/^moving-image-/, '');
      
      const filmDir = path.join(VIDEOS_DIR, dirSlug);
      const videoPath = path.join(filmDir, 'cover.mp4');
      
      console.log(`Film: ${film.title} (${film.slug})`);
      
      // Check if directory exists
      if (!fs.existsSync(filmDir)) {
        console.log(`  Creating directory: ${filmDir}`);
        fs.mkdirSync(filmDir, { recursive: true });
      }
      
      // Check if cover.mp4 exists
      if (fs.existsSync(videoPath)) {
        console.log(`  ✓ Video already exists: ${videoPath}`);
        skippedCount++;
        continue;
      }
      
      // Create a minimal MP4 file
      try {
        fs.writeFileSync(videoPath, MP4_HEADER);
        console.log(`  ✓ Created example video: ${videoPath}`);
        createdCount++;
      } catch (error) {
        console.error(`  ✗ Error creating video: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\nSummary:');
    console.log('-------');
    console.log(`Total films: ${films.length}`);
    console.log(`Created example videos: ${createdCount}`);
    console.log(`Skipped (already exist): ${skippedCount}`);
    
    console.log('\nNote: These are minimal MP4 files for testing purposes only.');
    console.log('They will not play any actual video content.');
    console.log('Replace them with real video files before deploying.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();