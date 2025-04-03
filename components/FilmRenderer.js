import React, { useState } from 'react';
import styles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import ClipView from '@/components/ClipView';

export default function FilmRenderer({ film }) {
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  
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
                setSelectedClipIndex(selectedClipIndex + 1);
              }
            }}
            onPrevClip={() => {
              if (selectedClipIndex > 0) {
                setSelectedClipIndex(selectedClipIndex - 1);
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
          
          {/* Clip Navigation */}
          <div className={styles.clipNavigation}>
            <h3>Clips:</h3>
            <div className={styles.clipList}>
              {film.clips.map((clip, index) => (
                <button
                  key={index}
                  className={`${styles.clipButton} ${selectedClipIndex === index ? styles.activeClip : ''}`}
                  onClick={() => setSelectedClipIndex(index)}
                >
                  {index + 1}. {clip.caption}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Fallback for empty or invalid content
  return <div className={styles.filmError}>No content available for this film.</div>;
}