import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
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
    return <div>Album not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{album.title} | Ethan MacCumber</title>
        <meta name="description" content={`${album.title} by Ethan MacCumber`} />
      </Head>

      <header className={styles.header}>
        <div className={styles.nameContainer}>
          <Link href="/" className={styles.name}>
            Ethan MacCumber
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/photographs" className={`${styles.navLink} ${styles.active}`}>
            photographs
          </Link>
          <Link href="/films" className={styles.navLink}>
            films
          </Link>
          <Link href="/writing" className={styles.navLink}>
            writing
          </Link>
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

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