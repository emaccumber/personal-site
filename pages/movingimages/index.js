import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { getAllMovingImageAlbums } from '@/lib/api';

export default function MovingImagesIndex({ albums }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Moving Images | Ethan MacCumber</title>
        <meta name="description" content="Moving image collections by Ethan MacCumber" />
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

      <main className={styles.main}>
        <div className={styles.albumsGrid}>
          {albums.map((album) => (
            <Link
              key={album.slug}
              href={`/movingimages/${album.slug}`}
              className={styles.albumCard}
            >
              <div className={styles.albumImageContainer}>
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    className={styles.albumImage}
                    width={400}
                    height={300}
                  />
                ) : (
                  <div className={styles.placeholderImage}></div>
                )}
              </div>
              <h2 className={styles.albumTitle}>{album.title}</h2>
              {album.description && (
                <p className={styles.albumDescription}>{album.description}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export function getStaticProps() {
  const albums = getAllMovingImageAlbums();
  
  return {
    props: {
      albums
    }
  };
}