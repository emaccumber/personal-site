import Layout from '@/components/Layout';
import BackLink from '@/components/BackLink';
import styles from '@/styles/Film.module.css';
import FilmRenderer from '@/components/FilmRenderer';
import { getAllFilms, getFilmBySlug } from '@/lib/api';

export default function FilmPage({ film }) {
  if (!film) {
    return (
      <Layout title="Film Not Found" activeNav="films">
        <div className={styles.filmError}>Film not found</div>
      </Layout>
    );
  }

  return (
    <Layout
      title={film.title}
      description={film.description}
      activeNav="films"
    >
      <BackLink href="/films" />

      <div className={styles.filmPageMain}>
        <FilmRenderer film={film} />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const film = getFilmBySlug(params.film);

  if (!film) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      film
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