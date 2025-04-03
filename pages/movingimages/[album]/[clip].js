import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import ClipView from '@/components/ClipView';
import { getAllMovingImageAlbums, getMovingImageAlbumBySlug } from '@/lib/api';

export default function ClipPage({ albums, album, clip, clipIndex, albumSlug }) {
  if (!album || !clip) {
    return <div>Clip not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{album.title} | Ethan MacCumber</title>
        <meta name="description" content={`Clip ${clipIndex + 1} from ${album.title} by Ethan MacCumber`} />
      </Head>

      <header className={styles.header}>
        <div className={styles.nameContainer}>
          <Link href="/" className={styles.name}>
            Ethan MacCumber
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/photographs" className={styles.navLink}>
            photographs
          </Link>
          <Link href="/films" className={styles.navLink}>
            films
          </Link>
          <Link href="/movingimages" className={`${styles.navLink} ${styles.active}`}>
            moving images
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
        <Link href="/movingimages">
          &lt;&lt;&lt;
        </Link>
      </div>

      <main className={styles.photoPageMain}>
        <ClipView
          clip={clip}
          albumSlug={albumSlug}
          clipIndex={clipIndex}
          totalClips={album.clips.length}
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

export function getStaticProps({ params }) {
  const albums = getAllMovingImageAlbums();
  const album = getMovingImageAlbumBySlug(params.album);

  if (!album) {
    return {
      notFound: true
    };
  }

  const clipIndex = parseInt(params.clip, 10) - 1; // Convert from 1-based to 0-based
  const clip = album.clips[clipIndex];

  if (!clip) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      albums,
      album,
      clip,
      clipIndex,
      albumSlug: params.album // Pass the album slug from URL params
    }
  };
}

export function getStaticPaths() {
  const albums = getAllMovingImageAlbums();

  const paths = [];

  // Generate paths for each clip in each album
  albums.forEach(albumInfo => {
    const album = getMovingImageAlbumBySlug(albumInfo.slug);
    if (album && album.clips) {
      album.clips.forEach((_, index) => {
        paths.push({
          params: {
            album: albumInfo.slug,
            clip: `${index + 1}` // Use 1-based indexing for URLs
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