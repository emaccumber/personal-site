import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/PhotoView.module.css';

export default function AlbumView({ album, initialPhotoIndex = 0 }) {
  const router = useRouter();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);
  const totalPhotos = album.photos.length;
  
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isFirst = currentPhotoIndex === 0;
  const isLast = currentPhotoIndex === totalPhotos - 1;
  const currentPhoto = album.photos[currentPhotoIndex];

  // Update URL without page navigation when photo changes
  useEffect(() => {
    if (router.isReady && album) {
      // Update URL to reflect current photo (for sharing/bookmarking)
      const newPath = `/photographs/${album.slug}?photo=${currentPhotoIndex + 1}`;
      router.push(newPath, undefined, { shallow: true });
    }
  }, [currentPhotoIndex, album, router.isReady]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Right arrow key navigates to next photo
      if (e.key === 'ArrowRight' && !isLast) {
        setCurrentPhotoIndex(prevIndex => prevIndex + 1);
      }
      // Left arrow key navigates to previous photo
      else if (e.key === 'ArrowLeft' && !isFirst) {
        setCurrentPhotoIndex(prevIndex => prevIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast]);

  const goToNextPhoto = useCallback(() => {
    if (!isLast) {
      setCurrentPhotoIndex(prevIndex => prevIndex + 1);
    }
  }, [isLast]);

  const goToPrevPhoto = useCallback(() => {
    if (!isFirst) {
      setCurrentPhotoIndex(prevIndex => prevIndex - 1);
    }
  }, [isFirst]);

  // Preload adjacent images
  useEffect(() => {
    const preloadImages = () => {
      // Preload next image if there is one
      if (!isLast) {
        const nextImg = new Image();
        nextImg.src = album.photos[currentPhotoIndex + 1].src;
      }
      
      // Preload previous image if there is one
      if (!isFirst) {
        const prevImg = new Image();
        prevImg.src = album.photos[currentPhotoIndex - 1].src;
      }
    };
    
    preloadImages();
  }, [currentPhotoIndex, album.photos, isFirst, isLast]);

  const handlePhotoClick = () => {
    if (!isLast) {
      goToNextPhoto();
    }
  };

  if (!currentPhoto) {
    return <div>Photo not found</div>;
  }

  return (
    <div className={styles.photoContainer}>
      <div className={styles.imageContainer}>
        <div className={styles.photoAndCaption}>
          <div className={styles.photoWrapper}>
            <img
              src={currentPhoto.src}
              alt={currentPhoto.caption || 'Photograph'}
              className={`${styles.photo} ${!isLast ? styles.clickable : ''} ${isImageLoading ? styles.fadeOut : styles.fadeIn}`}
              onClick={handlePhotoClick}
              onLoad={() => setIsImageLoading(false)}
              ref={(el) => {
                // This helps ensure the caption width matches the image width
                if (el) {
                  const captionEl = el.parentNode.parentNode.querySelector(`.${styles.caption}`);
                  if (captionEl) {
                    captionEl.style.width = `${el.width}px`;
                  }
                }
              }}
            />
          </div>
          {currentPhoto.caption && (
            <div className={styles.caption}>
              {currentPhoto.caption}
            </div>
          )}
        </div>
      </div>

      <div className={styles.arrowNavigation}>
        <button
          className={`${styles.navArrow} ${styles.leftArrow} ${isFirst ? styles.disabled : ''}`}
          aria-disabled={isFirst}
          onClick={goToPrevPhoto}
          disabled={isFirst}
        >
          &lt;
        </button>
        <button
          className={`${styles.navArrow} ${styles.rightArrow} ${isLast ? styles.disabled : ''}`}
          aria-disabled={isLast}
          onClick={goToNextPhoto}
          disabled={isLast}
        >
          &gt;
        </button>
      </div>

      {currentPhoto.description && (
        <div className={styles.description}>
          {currentPhoto.description}
        </div>
      )}
    </div>
  );
}