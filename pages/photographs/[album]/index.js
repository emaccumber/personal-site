import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPhotoAlbumBySlug, getAllPhotoAlbums } from '@/lib/api';

export default function AlbumLanding({ album }) {
  const router = useRouter();

  useEffect(() => {
    // Only proceed if the router is ready and has query params
    if (router.isReady) {
      // Redirect to the first photo in the album
      if (album && album.photos && album.photos.length > 0) {
        // Use router.query.album to get the album slug from the URL
        router.replace(`/photographs/${router.query.album}/1`);
      }
    }
  }, [album, router, router.isReady]);

  // This page will not be visible as it redirects immediately
  return null;
}

export async function getStaticProps({ params }) {
  const album = getPhotoAlbumBySlug(params.album);

  if (!album) {
    return {
      notFound: true
    };
  }

  return {
    props: { album }
  };
}

export async function getStaticPaths() {
  const albums = getAllPhotoAlbums();

  return {
    paths: albums.map((album) => ({
      params: { album: album.slug }
    })),
    fallback: false
  };
}