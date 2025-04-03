# Instructions to Fix Album Access Issues

We've changed the content directory from `_content/photography` to `_content/photographs` and updated all the references in the JSON files. However, you're still experiencing 404 errors when trying to access the Rabat album. Here's how to fix it:

## Complete Rebuild Process

1. **Move the image files** to match the new path structure:
   ```bash
   mkdir -p public/images/photographs/rabat
   cp -r public/images/photography/rabat/* public/images/photographs/rabat/
   ```

2. **Clean the Next.js cache**:
   ```bash
   rm -rf .next
   ```

3. **Rebuild the site**:
   ```bash
   npm run build
   ```

4. **Start the site**:
   ```bash
   npm run start
   ```

## What's Happening?

The issue is likely related to Next.js static site generation. When you changed the content directory and image paths, the statically generated pages are still using the old paths because:

1. The `.next` directory contains cached/built pages that were generated with the old configuration
2. The fallback is set to `false` in `getStaticPaths`, which means any paths not generated at build time will 404

By cleaning the `.next` directory and rebuilding, you force Next.js to regenerate all the static pages with the updated paths.

## Alternative Solution

If you don't want to move the images, you could update the JSON files to point back to the original `/images/photography/` path. In that case:

1. Revert the changes to the image paths in the JSON files
2. Clean and rebuild as described above

The key point is that the paths in your JSON files need to match the actual location of your image files, and the statically generated pages need to be rebuilt after any changes to paths or content structure.