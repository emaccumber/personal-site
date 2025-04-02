import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import filmStyles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import { getAllFilms, getFilmBySlug } from '@/lib/api';

export default function FilmPage({ films, film, filmSlug }) {
  if (!film) {
    return <div>Film not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{film.title} | Ethan MacCumber</title>
        <meta name="description" content={film.description} />
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

      <div className={styles.backToAlbums}>
        <Link href="/films">
          &lt;&lt;&lt;
        </Link>
      </div>

      <main className={filmStyles.filmPageMain}>
        <VimeoPlayer vimeoId={film.vimeoId} />

        <div className={filmStyles.filmInfo}>
          {film.subtitle && <h1 className={filmStyles.filmTitle}>{film.subtitle}</h1>}

          {film.director && <p className={filmStyles.filmDirector}>{film.director}</p>}

          {film.filmmaker && <p className={filmStyles.filmMaker}>{film.filmmaker}</p>}

          {film.date && <p className={filmStyles.filmDate}>{film.date}</p>}

          {film.description && (
            <div className={filmStyles.filmDescription}>
              {film.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const films = getAllFilms();
  const film = getFilmBySlug(params.film);

  if (!film) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      films,
      film,
      filmSlug: params.film
    }
  };
}

export async function getStaticPaths() {
  const films = getAllFilms();

  return {
    paths: films.map((film) => ({
      params: { film: film.slug }
    })),
    fallback: false
  };
}