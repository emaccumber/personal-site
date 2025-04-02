import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import PhotoView from '@/components/PhotoView';
import { getAllPhotoAlbums, getPhotoAlbumBySlug } from '@/lib/api';

export default function PhotoPage({ albums, album, photo, photoIndex, albumSlug }) {
  if (!album || !photo) {
    return <div>Photo not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{album.title} | Ethan MacCumber</title>
        <meta name="description" content={`Photo ${photoIndex + 1} from ${album.title} by Ethan MacCumber`} />
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
        <PhotoView
          photo={photo}
          albumSlug={albumSlug}
          photoIndex={photoIndex}
          totalPhotos={album.photos.length}
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
  const albums = getAllPhotoAlbums();
  const album = getPhotoAlbumBySlug(params.album);

  if (!album) {
    return {
      notFound: true
    };
  }

  const photoIndex = parseInt(params.photo, 10) - 1; // Convert from 1-based to 0-based
  const photo = album.photos[photoIndex];

  if (!photo) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      albums,
      album,
      photo,
      photoIndex,
      albumSlug: params.album // Pass the album slug from URL params
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