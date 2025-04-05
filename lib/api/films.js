import fs from 'fs';
import path from 'path';
import { filmsDirectory } from './config';
import { getMediaUrl } from './media';

/**
 * Get all films (including moving image albums)
 * @returns {Array} Array of film objects
 */
export function getAllFilms() {
  try {
    const filmsPath = path.join(filmsDirectory, 'films.json');
    if (!fs.existsSync(filmsPath)) {
      console.error('Films file not found:', filmsPath);
      return [];
    }

    const filmsData = JSON.parse(fs.readFileSync(filmsPath, 'utf8'));

    // Process films to use the appropriate URLs and mark moving image albums
    return filmsData.films.map(film => {
      // Process cover image
      const processedFilm = {
        ...film,
        coverImage: getMediaUrl(film.coverImage)
      };

      // Handle moving image albums
      if (film.type === 'moving-image-album') {
        return {
          ...processedFilm,
          isMovingImageAlbum: true,
          slug: `moving-image-${film.slug}`
        };
      }

      return processedFilm;
    });
  } catch (error) {
    console.error('Error loading films:', error);
    return [];
  }
}

/**
 * Get all moving image albums
 * @returns {Array} Array of moving image album objects
 */
export function getAllMovingImageAlbums() {
  try {
    const films = getAllFilms();
    return films
      .filter(film => film.isMovingImageAlbum)
      .map(film => ({
        ...film,
        slug: film.slug.replace('moving-image-', '')
      }));
  } catch (error) {
    console.error('Error loading moving image albums:', error);
    return [];
  }
}

/**
 * Get a specific film by slug
 * @param {string} slug - The film slug
 * @returns {Object|null} The film object or null if not found
 */
export function getFilmBySlug(slug) {
  try {
    console.log(`Getting film by slug: ${slug}`);

    // Check if this is a moving image album
    if (slug.startsWith('moving-image-')) {
      console.log(`This is a moving image album: ${slug}`);
      const albumSlug = slug.replace('moving-image-', '');
      console.log(`Album slug: ${albumSlug}`);

      const album = getMovingImageAlbumBySlug(albumSlug);
      if (album) {
        console.log(`Album found for slug: ${albumSlug}`);
        return {
          ...album,
          type: 'moving-image-album',
          originalSlug: albumSlug
        };
      } else {
        console.log(`No album found for slug: ${albumSlug}`);
      }
    }

    // Otherwise, load the film data from JSON
    console.log(`Loading regular film data for slug: ${slug}`);
    const filmPath = path.join(filmsDirectory, `${slug}.json`);
    console.log(`Film path: ${filmPath}`);

    if (!fs.existsSync(filmPath)) {
      console.error(`Film file not found for slug: ${slug}`);
      return null;
    }

    const filmData = JSON.parse(fs.readFileSync(filmPath, 'utf8'));
    console.log(`Film data loaded for ${slug}:`, filmData.title);

    // Process media URLs
    return {
      ...filmData,
      coverImage: getMediaUrl(filmData.coverImage)
    };
  } catch (error) {
    console.error(`Error loading film ${slug}:`, error);
    console.error(error.stack);
    return null;
  }
}

/**
 * Get a specific moving image album by slug
 * @param {string} slug - The album slug
 * @returns {Object|null} The album object or null if not found
 */
export function getMovingImageAlbumBySlug(slug) {
  try {
    // Log the slug and directory for debugging
    console.log(`Loading moving image album for slug: ${slug}`);
    console.log(`Looking in directory: ${filmsDirectory}`);

    const albumPath = path.join(filmsDirectory, `${slug}.json`);
    console.log(`Full path: ${albumPath}`);

    if (!fs.existsSync(albumPath)) {
      console.error(`Moving image album file not found for slug: ${slug}`);
      return null;
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(albumPath, 'utf8');
    console.log(`File content loaded, length: ${fileContent.length}`);

    const albumData = JSON.parse(fileContent);
    console.log(`Album data parsed:`, albumData.title);

    // Process clip URLs
    return {
      ...albumData,
      clips: albumData.clips.map(clip => ({
        ...clip,
        src: getMediaUrl(clip.src)
      }))
    };
  } catch (error) {
    console.error(`Error loading moving image album ${slug}:`, error);
    console.error(error.stack);
    return null;
  }
}

/**
 * Get a specific clip in an album by index
 * @param {string} albumSlug - The album slug
 * @param {number} clipIndex - The clip index
 * @returns {Object|null} The clip object or null if not found
 */
export function getClipByIndex(albumSlug, clipIndex) {
  try {
    const album = getMovingImageAlbumBySlug(albumSlug);
    if (!album || !album.clips || clipIndex >= album.clips.length) {
      return null;
    }
    return album.clips[clipIndex];
  } catch (error) {
    console.error(`Error loading clip ${clipIndex} from album ${albumSlug}:`, error);
    return null;
  }
}
