import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import ClipView from '@/components/ClipView';

export default function FilmRenderer({ film }) {
  const router = useRouter();
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  
  // Parse clip query parameter from URL
  useEffect(() => {
    if (film.type === 'moving-image-album' && router.query.clip) {
      const clipIndex = parseInt(router.query.clip, 10) - 1;
      if (clipIndex >= 0 && clipIndex < film.clips.length) {
        setSelectedClipIndex(clipIndex);
      }
    }
  }, [router.query.clip, film]);

  // Update URL when clip changes with minimal changes
  const updateClip = (newIndex) => {
    if (newIndex >= 0 && newIndex < film.clips.length) {
      // Update state immediately for smooth UI experience
      setSelectedClipIndex(newIndex);
      
      // Update URL without triggering a full navigation
      const slug = film.originalSlug || film.slug.replace('moving-image-', '');
      const url = `/films/moving-image-${slug}?clip=${newIndex + 1}`;
      
      // Use history API directly - simplest approach to avoid Next.js router complexity
      window.history.replaceState(
        { as: url, url: url },
        '',
        url
      );
    }
  };

  // Handle regular films with Vimeo videos
  if (!film.type || film.type !== 'moving-image-album') {
    return (
      <>
        <VimeoPlayer vimeoId={film.vimeoId} />
        <div className={styles.filmInfo}>
          {film.subtitle && <h1 className={styles.filmTitle}>{film.subtitle}</h1>}
          {film.director && <p className={styles.filmDirector}>{film.director}</p>}
          {film.filmmaker && <p className={styles.filmMaker}>{film.filmmaker}</p>}
          {film.date && <p className={styles.filmDate}>{film.date}</p>}
          {film.description && (
            <div className={styles.filmDescription}>
              {film.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Handle moving image albums
  if (film.type === 'moving-image-album' && film.clips && film.clips.length > 0) {
    const currentClip = film.clips[selectedClipIndex];

    return (
      <>
        <div className={styles.movingImageContainer}>
          <ClipView
            clip={currentClip}
            albumSlug={film.originalSlug}
            clipIndex={selectedClipIndex}
            totalClips={film.clips.length}
            onNextClip={() => {
              if (selectedClipIndex < film.clips.length - 1) {
                updateClip(selectedClipIndex + 1);
              }
            }}
            onPrevClip={() => {
              if (selectedClipIndex > 0) {
                updateClip(selectedClipIndex - 1);
              }
            }}
          />
        </div>

        <div className={styles.filmInfo}>
          <h1 className={styles.filmTitle}>{film.title}</h1>
          {film.date && <p className={styles.filmDate}>{film.date}</p>}
          {film.description && (
            <div className={styles.filmDescription}>
              {film.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Fallback for empty or invalid content
  return <div className={styles.filmError}>No content available for this film.</div>;
}