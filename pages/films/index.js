import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { getAllFilms } from '@/lib/api';

export default function Films({ films }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Films | Ethan MacCumber</title>
        <meta name="description" content="Films by Ethan MacCumber" />
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
          <Link href="/films" className={`${styles.navLink} ${styles.active}`}>
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

      <main className={styles.galleryContainer}>
        {films.map((film) => (
          <Link
            href={`/films/${film.slug}`}
            key={film.id}
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img
                src={film.coverImage}
                alt={film.title}
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{film.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const films = getAllFilms();
  return {
    props: { films }
  };
}