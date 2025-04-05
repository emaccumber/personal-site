// Export media utility that can be used on both client and server
export { getMediaUrl } from './media';

// These functions should only be used in getStaticProps or getServerSideProps
// They use Node.js modules like fs and path which aren't available in the browser
export {
  getAllPhotoAlbums,
  getPhotoAlbumBySlug,
  getPhotoByIndex,
  getAllFilms,
  getFilmBySlug,
  getAllMovingImageAlbums,
  getMovingImageAlbumBySlug,
  getClipByIndex,
  getAllWritingPosts,
  getWritingPostBySlug,
  getInformationContent
} from './server';

