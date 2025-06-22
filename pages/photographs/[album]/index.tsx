import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import AlbumView from '@/components/AlbumView';
import { getAllPhotoAlbums, getPhotoAlbumBySlug } from '@/lib/api';
import type { PhotoAlbum } from '@/types';
import type { GetStaticProps, GetStaticPaths } from 'next';

interface Props {
  album: PhotoAlbum;
}

export default function AlbumPage({ album }: Props) {
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
    return <div>Album not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{album.title} | Ethan MacCumber</title>
        <meta name="description" content={`${album.title} by Ethan MacCumber`} />
      </Head>

      <Header />

      <div className={styles.backToAlbums}>
        <Link href="/photographs">
          &lt;&lt;&lt;
        </Link>
      </div>

      <main className={styles.photoPageMain}>
        <AlbumView 
          album={album}
          initialPhotoIndex={initialPhotoIndex}
        />

        {album.description && (
          <div className={styles.albumDescription}>
            {album.description}
          </div>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const album = getPhotoAlbumBySlug(params?.album as string);

  if (!album) {
    return {
      notFound: true
    };
  }

  return {
    props: { album }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const albums = getAllPhotoAlbums();

  return {
    paths: albums.map((album) => ({
      params: { album: album.slug }
    })),
    fallback: false
  };
};