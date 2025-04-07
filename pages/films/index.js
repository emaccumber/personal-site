import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getAllFilms } from '@/lib/api';
import Link from 'next/link';

export default function Films({ films }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Films | Ethan MacCumber</title>
        <meta name="description" content="Films by Ethan MacCumber" />
      </Head>

      <Header />

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