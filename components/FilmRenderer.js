import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import PreloadedClipView from '@/components/PreloadedClipView';
import ClientOnly from '@/components/ClientOnly';

export default function FilmRenderer({ film }) {
  const router = useRouter();
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  
  // Parse clip query parameter only on initial load
  useEffect(() => {
    if (router.isReady && film.type === 'moving-image-album' && router.query.clip) {
      const clipIndex = parseInt(router.query.clip, 10) - 1;
      if (clipIndex >= 0 && clipIndex < film.clips.length) {
        setCurrentClipIndex(clipIndex);
      }
    }
  }, [router.isReady, film]);

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
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '1000px', // Increased from original value
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        <div className={styles.movingImageContainer}>
          <ClientOnly
            placeholder={
              <div style={{
                position: 'relative',
                paddingBottom: '75%', // 4:3 aspect ratio
                height: 0,
                overflow: 'hidden',
                background: '#f0f0f0'
              }}>
              </div>
            }
          >
            <PreloadedClipView
              clips={film.clips}
              currentClipIndex={currentClipIndex}
              onNextClip={() => setCurrentClipIndex(prevIndex => 
                Math.min(prevIndex + 1, film.clips.length - 1)
              )}
              onPrevClip={() => setCurrentClipIndex(prevIndex => 
                Math.max(prevIndex - 1, 0)
              )}
            />
          </ClientOnly>
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
      </div>
    );
  }

  // Fallback for empty or invalid content
  return <div className={styles.filmError}>No content available for this film.</div>;
}