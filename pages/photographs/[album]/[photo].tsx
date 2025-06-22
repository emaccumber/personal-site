import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllPhotoAlbums, getPhotoAlbumBySlug } from '@/lib/api';

// This is now just a redirect page to the new album view with the correct photo
export default function PhotoRedirect({ albumSlug, photoIndex }) {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      // Redirect to the album page with the photo query parameter
      router.replace(`/photographs/${albumSlug}?photo=${photoIndex + 1}`);
    }
  }, [router.isReady, albumSlug, photoIndex]);

  // Return null as this is just a redirect page
  return null;
}

export async function getStaticProps({ params }) {
  const album = getPhotoAlbumBySlug(params.album);

  if (!album) {
    return {
      notFound: true
    };
  }

  const photoIndex = parseInt(params.photo, 10) - 1; // Convert from 1-based to 0-based
  
  if (isNaN(photoIndex) || photoIndex < 0 || photoIndex >= album.photos.length) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      albumSlug: params.album,
      photoIndex
    }
  };
}

export async function getStaticPaths() {
  const albums = getAllPhotoAlbums();

  const paths = [];

  // Generate paths for each photo in each album
  albums.forEach(albumInfo => {
    const album = getPhotoAlbumBySlug(albumInfo.slug);
    if (album && album.photos) {
      album.photos.forEach((_, index) => {
        paths.push({
          params: {
            album: albumInfo.slug,
            photo: `${index + 1}` // Use 1-based indexing for URLs
          }
        });
      });
    }
  });

  return {
    paths,
    fallback: false
  };
}