import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import filmStyles from '@/styles/Film.module.css';
import Header from '@/components/Header';
import FilmRenderer from '@/components/FilmRenderer';
import { getAllFilms, getFilmBySlug } from '@/lib/api';

export default function FilmPage({ films, film, filmSlug }) {
  const router = useRouter();

  // Use router.isReady to ensure page doesn't flicker on shallow routing
  if (!router.isReady || !film) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{film.title} | Ethan MacCumber</title>
        <meta name="description" content={film.description} />
      </Head>

      <Header />

      <div className={styles.backToAlbums}>
        <Link href="/films">
          &lt;&lt;&lt;
        </Link>
      </div>

      <main className={filmStyles.filmPageMain}>
        <FilmRenderer film={film} />
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