import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Gallery.module.css';
import { getAllFilms } from '@/lib/api';

export default function Films({ films }) {
  return (
    <Layout
      title="Films"
      description="Films by Ethan MacCumber"
      activeNav="films"
    >
      <div className={styles.galleryContainer}>
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
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const films = getAllFilms();
  return {
    props: { films }
  };
}