#!/usr/bin/env node

/**
 * Script to create directory structure for film thumbnail videos
 * 
 * This script reads the films.json file and creates the necessary directory
 * structure for storing video thumbnails (cover.mp4 files) for each film.
 * 
 * Usage:
 * node create-thumbnail-dirs.js
 */

const fs = require('fs');
const path = require('path');

// Path constants
const CONTENT_DIR = path.join(process.cwd(), '_content');
const FILMS_JSON_PATH = path.join(CONTENT_DIR, 'films', 'films.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const FILMS_VIDEOS_DIR = path.join(VIDEOS_DIR, 'films');

// Create base directories if they don't exist
function createBaseDirs() {
  console.log('Creating base directories...');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
    console.log(`Created: ${PUBLIC_DIR}`);
  }
  
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR);
    console.log(`Created: ${VIDEOS_DIR}`);
  }
  
  if (!fs.existsSync(FILMS_VIDEOS_DIR)) {
    fs.mkdirSync(FILMS_VIDEOS_DIR);
    console.log(`Created: ${FILMS_VIDEOS_DIR}`);
  }
}

// Create film thumbnail directories based on films.json
async function createFilmDirs() {
  console.log('Reading films.json...');
  
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
    console.log(`Found ${films.length} films in films.json`);
    
    // Create directory for each film
    for (const film of films) {
      if (!film.slug) {
        console.warn('Warning: Film without slug found, skipping...');
        continue;
      }
      
      // Remove "moving-image-" prefix from slug if present (for directory structure)
      const dirSlug = film.slug.replace(/^moving-image-/, '');
      
      // Create directory for this film's videos
      const filmDir = path.join(FILMS_VIDEOS_DIR, dirSlug);
      
      if (!fs.existsSync(filmDir)) {
        fs.mkdirSync(filmDir);
        console.log(`Created directory: ${filmDir}`);
      }
      
      // Create a placeholder README file with instructions
      const readmePath = path.join(filmDir, 'README.txt');
      if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(
          readmePath,
          `Thumbnail Video Instructions for "${film.title}"\n` +
          `------------------------------------------\n\n` +
          `1. Create a short video clip (3-5 seconds recommended)\n` +
          `2. Name it "cover.mp4"\n` +
          `3. Place it in this directory\n` +
          `4. Upload using the upload script: npm run upload-media\n\n` +
          `Note: The first frame of the video will be shown before hover,\n` +
          `so ensure it matches the quality of your static cover image.`
        );
        console.log(`Created instructions: ${readmePath}`);
      }
    }
    
    console.log('\nDirectory structure created successfully!');
    console.log(`Now place your video thumbnails as "cover.mp4" in the corresponding project folders.`);
    
  } catch (error) {
    console.error('Error processing films.json:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('Setting up directories for film video thumbnails...\n');
  
  // Create base directories
  createBaseDirs();
  
  // Create film-specific directories
  await createFilmDirs();
}

main();
