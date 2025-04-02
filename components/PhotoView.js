import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PhotoView.module.css';

export default function PhotoView({ photo, albumSlug, photoIndex, totalPhotos }) {
  const isFirst = photoIndex === 0;
  const isLast = photoIndex === totalPhotos - 1;

  const prevLink = isFirst ? '#' : `/photographs/${albumSlug}/${photoIndex}`;
  const nextLink = isLast ? '#' : `/photographs/${albumSlug}/${photoIndex + 2}`; // +2 because we're using 1-based indexing in URLs

  return (
    <div className={styles.photoContainer}>
      <div className={styles.photoWrapper}>
        <img
          src={photo.src}
          alt={photo.caption || 'Photograph'}
          className={styles.photo}
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