import React, { useState } from 'react';
import styles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import ClipView from '@/components/ClipView';

// Helper function to render paragraphs from text with newlines
const renderParagraphs = (text) => {
  if (!text) return null;
  return text.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
};

// Component for film metadata
const FilmInfo = ({ film }) => (
  <div className={styles.filmInfo}>
    {film.subtitle && <h1 className={styles.filmTitle}>{film.subtitle}</h1>}
    {!film.subtitle && film.title && <h1 className={styles.filmTitle}>{film.title}</h1>}
    {film.director && <p className={styles.filmDirector}>{film.director}</p>}
    {film.filmmaker && <p className={styles.filmMaker}>{film.filmmaker}</p>}
    {film.date && <p className={styles.filmDate}>{film.date}</p>}
    {film.description && (
      <div className={styles.filmDescription}>
        {renderParagraphs(film.description)}
      </div>
    )}
  </div>
);

export default function FilmRenderer({ film }) {
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);

  // Handle case where film data is missing
  if (!film) {
    return <div className={styles.filmError}>Film data not available.</div>;
  }

  // Handle regular films with Vimeo videos
  if (!film.type || film.type !== 'moving-image-album') {
    return (
      <>
        <VimeoPlayer vimeoId={film.vimeoId} />
        <FilmInfo film={film} />
      </>
    );
  }

  // Handle moving image albums
  if (film.clips && film.clips.length > 0) {
    const currentClip = film.clips[selectedClipIndex];

    const handleNextClip = () => {
      if (selectedClipIndex < film.clips.length - 1) {
        setSelectedClipIndex(selectedClipIndex + 1);
      }
    };

    const handlePrevClip = () => {
      if (selectedClipIndex > 0) {
        setSelectedClipIndex(selectedClipIndex - 1);
      }
    };

    return (
      <>
        <div className={styles.movingImageContainer}>
          <ClipView
            clip={currentClip}
            albumSlug={film.originalSlug}
            clipIndex={selectedClipIndex}
            totalClips={film.clips.length}
            onNextClip={handleNextClip}
            onPrevClip={handlePrevClip}
          />
        </div>
        <FilmInfo film={film} />
      </>
    );
  }

  // Fallback for empty or invalid content
  return <div className={styles.filmError}>No content available for this film.</div>;
}