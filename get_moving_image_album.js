// This function should replace the current getMovingImageAlbumBySlug function in your api.js file

// Get a specific moving image album by slug
export function getMovingImageAlbumBySlug(slug) {
  try {
    // Read from the JSON file in _content/films
    const fullPath = path.join(filmsDirectory, `${slug}.json`);
    
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      // Read and parse the JSON file
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const album = JSON.parse(fileContents);
      return album;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading moving image album ${slug}:`, error);
    return null;
  }
}
