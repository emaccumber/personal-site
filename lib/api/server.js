// This file re-exports all server-side API functions
// These functions should only be used in getStaticProps or getServerSideProps

// Photographs
export { getAllPhotoAlbums, getPhotoAlbumBySlug, getPhotoByIndex } from './photographs';

// Films
export { 
  getAllFilms, 
  getFilmBySlug, 
  getAllMovingImageAlbums, 
  getMovingImageAlbumBySlug, 
  getClipByIndex 
} from './films';

// Writing
export { getAllWritingPosts, getWritingPostBySlug } from './writing';

// Information
export { getInformationContent } from './information';
