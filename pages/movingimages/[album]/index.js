import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMovingImageAlbumBySlug, getAllMovingImageAlbums } from '@/lib/api';

export default function AlbumLanding({ album }) {
  const router = useRouter();

  useEffect(() => {
    // Only proceed if the router is ready and has query params
    if (router.isReady) {
      // Redirect to the first clip in the album
      if (album && album.clips && album.clips.length > 0) {
        // Use router.query.album to get the album slug from the URL
        router.replace(`/movingimages/${router.query.album}/1`);
      }
    }
  }, [album, router, router.isReady]);

  // This page will not be visible as it redirects immediately
  return null;
}

export function getStaticProps({ params }) {
  const album = getMovingImageAlbumBySlug(params.album);

  if (!album) {
    return {
      notFound: true
    };
  }

  return {
    props: { album }
  };
}

export function getStaticPaths() {
  const albums = getAllMovingImageAlbums();

  return {
    paths: albums.map((album) => ({
      params: { album: album.slug }
    })),
    fallback: false
  };
}