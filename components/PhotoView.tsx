import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/PhotoView.module.css';
import type { Photo } from '@/types';

interface Props {
  photo: Photo;
  albumSlug: string;
  photoIndex: number;
  totalPhotos: number;
}

export default function PhotoView({ photo, albumSlug, photoIndex, totalPhotos }: Props) {
  const router = useRouter();
  const isFirst = photoIndex === 0;
  const isLast = photoIndex === totalPhotos - 1;
  
  const prevLink = isFirst ? '#' : `/photographs/${albumSlug}/${photoIndex}`;
  const nextLink = isLast ? '#' : `/photographs/${albumSlug}/${photoIndex + 2}`; // +2 because we're using 1-based indexing in URLs

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Right arrow key navigates to next photo
      if (e.key === 'ArrowRight' && !isLast) {
        router.push(nextLink);
      }
      // Left arrow key navigates to previous photo
      else if (e.key === 'ArrowLeft' && !isFirst) {
        router.push(prevLink);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, nextLink, prevLink, router]);

  const handlePhotoClick = () => {
    if (!isLast) {
      router.push(nextLink);
    }
  };

  return (
    <div className={styles.photoContainer}>
      <div className={styles.photoWrapper}>
        <img
          src={photo.src}
          alt={photo.caption || 'Photograph'}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '80vh'
          }}
          className={`${styles.photo} ${!isLast ? styles.clickable : ''}`}
          onClick={handlePhotoClick}
        />
        {photo.caption && (
          <div className={styles.caption}>
            {photo.caption}
          </div>
        )}
      </div>

      <div className={styles.arrowNavigation}>
        <Link
          href={prevLink}
          className={`${styles.navArrow} ${styles.leftArrow} ${isFirst ? styles.disabled : ''}`}
          aria-disabled={isFirst}
          onClick={e => isFirst && e.preventDefault()}
        >
          &lt;
        </Link>
        <Link
          href={nextLink}
          className={`${styles.navArrow} ${styles.rightArrow} ${isLast ? styles.disabled : ''}`}
          aria-disabled={isLast}
          onClick={e => isLast && e.preventDefault()}
        >
          &gt;
        </Link>
      </div>

      {photo.description && (
        <div className={styles.description}>
          {photo.description}
        </div>
      )}
    </div>
  );
}