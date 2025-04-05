# Fixing the Moving Image Album

I've identified the issue with the 16mm moving images album. There are two main problems:

1. **Only 3 clips showing**: The `getMovingImageAlbumBySlug` function in api.js has hardcoded data with only 3 clips
2. **Clips not loading**: The hardcoded src paths are incorrect (`clip1.mp4` instead of `1.mp4`)

## Quick Fix

Replace the `getMovingImageAlbumBySlug` function in `/Users/ethan/Desktop/repos.nosync/personal-site/lib/api.js` with this updated version:

```javascript
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
```

Look for the function around line 350 in the file. You're replacing the entire function including the hardcoded 16mm-project data.

## Alternate Solution

If the above fix doesn't work, you could simply replace your entire api.js file with the updated version I provided at:

```
/Users/ethan/Desktop/repos.nosync/personal-site/lib/api_updated.js
```

Just rename it to replace the original api.js file.

## What This Fix Does

1. Removes the hardcoded data that was limiting your clips to only 3
2. Properly reads from your 16mm-project.json file which has all 9 clips defined
3. Uses the correct file paths matching what's in your public directory

After making these changes, the 16mm Film Sketches album should:
- Show all 9 clips
- Load the videos properly
- Use the correct URLs with query parameters