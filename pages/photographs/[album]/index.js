import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import BackLink from '@/components/BackLink';
import styles from '@/styles/Album.module.css';
import AlbumView from '@/components/AlbumView';
import { getAllPhotoAlbums, getPhotoAlbumBySlug } from '@/lib/api';

export default function AlbumPage({ album }) {
  const router = useRouter();
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

  useEffect(() => {
    // Check if there's a photo query parameter
    if (router.isReady && router.query.photo) {
      const photoIndex = parseInt(router.query.photo, 10) - 1; // Convert from 1-based to 0-based
      if (!isNaN(photoIndex) && photoIndex >= 0 && photoIndex < album.photos.length) {
        setInitialPhotoIndex(photoIndex);
      }
    }
  }, [router.isReady, router.query.photo, album.photos.length]);

  if (!album) {
    return (
      <Layout title="Album Not Found" activeNav="photographs">
        <div className={styles.albumError}>Album not found</div>
      </Layout>
    );
  }

  return (
    <Layout
      title={album.title}
      description={`${album.title} by Ethan MacCumber`}
      activeNav="photographs"
    >
      <BackLink href="/photographs" />

      <div className={styles.albumPageMain}>
        <AlbumView
          album={album}
          initialPhotoIndex={initialPhotoIndex}
        />

        {album.description && (
          <div className={styles.albumDescription}>
            {album.description}
          </div>
        )}
      </div>
    </Layout>
  );
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