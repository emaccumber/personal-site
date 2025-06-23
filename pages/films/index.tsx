import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getAllFilms } from '@/lib/api';
import { getMediaUrl } from '@/lib/mediaUrl';
import Link from 'next/link';
import VideoThumbnail from '@/components/VideoThumbnail';
import { useEffect, useState } from 'react';
import type { Film } from '@/types';
import type { GetStaticProps } from 'next';

interface Props {
  films: Film[];
}

export default function Films({ films }: Props) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Films | Ethan MacCumber</title>
        <meta name="description" content="Films and moving images by Ethan MacCumber. Experience visual narratives in motion." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Films | Ethan MacCumber" />
        <meta property="og:description" content="Films and moving images by Ethan MacCumber. Experience visual narratives in motion." />
        <meta property="og:url" content="https://ethanmaccumber.com/films" />
        <meta name="twitter:title" content="Films | Ethan MacCumber" />
        <meta name="twitter:description" content="Films and moving images by Ethan MacCumber. Experience visual narratives in motion." />
      </Head>

      <Header />

      <main className={styles.galleryContainer}>
        {films.map((film) => (
          <Link
            href={`/films/${film.slug}`}
            key={film.id}
            className={styles.galleryItem}
          >
            {film.coverImage.toLowerCase().endsWith('.mp4') ? (
              // Always use VideoThumbnail for .mp4 files
              <VideoThumbnail
                src={getMediaUrl(film.coverImage)}
                alt={film.title}
                filmSlug={film.slug}
              />
            ) : (
              // Use regular img for image files (jpg, png, etc.)
              <div className={styles.galleryImageContainer}>
                <img
                  src={getMediaUrl(film.coverImage)}
                  alt={film.title}
                  className={styles.galleryImage}
                />
              </div>
            )}
            <h2 className={styles.galleryTitle}>{film.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const films = getAllFilms();
  console.log("Films data:", JSON.stringify(films, null, 2));
  return {
    props: { films }
  };
};