import React from 'react';
import Link from 'next/link';
import styles from '@/styles/FilmSubNav.module.css';

export default function FilmSubNav({ films, currentFilm }) {
  return (
    <nav className={styles.subNav}>
      {films.map((film) => (
        <Link
          href={`/films/${film.slug}`}
          key={film.id}
          className={`${styles.subNavLink} ${currentFilm === film.slug ? styles.active : ''}`}
        >
          {film.title}
        </Link>
      ))}
    </nav>
  );
}