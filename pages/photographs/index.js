import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { getAllPhotoAlbums } from '@/lib/api';

export default function Photographs({ albums }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Photographs | Ethan MacCumber</title>
        <meta name="description" content="Photography collections by Ethan MacCumber" />
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
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.galleryContainer}>
        {albums.map((album) => (
          <Link 
            href={`/photographs/${album.slug}`} 
            key={album.id} 
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img 
                src={album.coverImage} 
                alt={album.title} 
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{album.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const albums = getAllPhotoAlbums();
  return {
    props: { albums }
  };
}