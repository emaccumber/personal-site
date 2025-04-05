// In your FilmRenderer.js file:

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Film.module.css';
import VimeoPlayer from '@/components/VimeoPlayer';
import SimpleClipView from '@/components/SimpleClipView';

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

  // Handler for navigating between clips
  const navigateToClip = (newIndex) => {
    if (newIndex >= 0 && newIndex < film.clips.length) {
      setCurrentClipIndex(newIndex);
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
    const currentClip = film.clips[currentClipIndex];

    return (
      <>
        <div className={styles.movingImageContainer}>
          <SimpleClipView
            key={`clip-${currentClipIndex}`}
            clip={currentClip}
            clipIndex={currentClipIndex}
            totalClips={film.clips.length}
            onNextClip={() => navigateToClip(currentClipIndex + 1)}
            onPrevClip={() => navigateToClip(currentClipIndex - 1)}
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

// In a new file SimpleClipView.js:

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/ClipView.module.css';

export default function SimpleClipView({
  clip,
  clipIndex,
  totalClips,
  onNextClip,
  onPrevClip
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isMouseInteracting, setIsMouseInteracting] = useState(false);
  const mouseMovementRef = useRef(0);
  const lastMouseXRef = useRef({ x: 0, y: 0 });
  const videoLengthRef = useRef(0);
  const totalMovementRef = useRef(0);

  const isFirst = clipIndex === 0;
  const isLast = clipIndex === totalClips - 1;

  // Handle video load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      videoLengthRef.current = video.duration;
      video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [clip.src]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setIsPlaying(false);
      setHasReachedEnd(true);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Right arrow key navigates to next clip
      if (e.key === 'ArrowRight' && !isLast) {
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        if (onNextClip) onNextClip();
      }
      // Left arrow key navigates to previous clip
      else if (e.key === 'ArrowLeft' && !isFirst) {
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        if (onPrevClip) onPrevClip();
      }
      // Space bar toggles play/pause
      else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); // Prevent page scrolling
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onNextClip, onPrevClip, isPlaying]);

  // Mouse movement handler for frame-by-frame scrubbing
  const handleMouseMove = (e) => {
    if (!videoRef.current || isPlaying || !isMouseInteracting) return;

    const video = videoRef.current;
    if (!video) return;

    // Calculate distance moved (absolute value for any movement)
    const currentX = e.clientX;
    const currentY = e.clientY;
    const prevX = lastMouseXRef.current.x;
    const prevY = lastMouseXRef.current.y;

    // Calculate total movement using Pythagorean theorem
    const deltaX = currentX - prevX;
    const deltaY = currentY - prevY;
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (movement > 0 && !hasReachedEnd) {
      // Accumulate total movement
      totalMovementRef.current += movement;

      // Calculate what fraction of the video we should have progressed through
      const videoDuration = videoLengthRef.current;

      // We want to go through the entire clip with more movement for slower frame changes
      const totalRequiredMovement = 5000;
      const progress = Math.min(totalMovementRef.current / totalRequiredMovement, 1.0);

      // Set absolute time position rather than incrementing
      const newTime = progress * videoDuration;

      if (newTime >= videoDuration) {
        // We've reached the end
        video.currentTime = videoDuration;
        setHasReachedEnd(true);
      } else {
        // Set to calculated absolute position
        video.currentTime = newTime;
      }
    }

    // Store current position for next calculation
    lastMouseXRef.current = { x: currentX, y: currentY };
  };

  const handleMouseEnter = (e) => {
    if (!videoRef.current || isPlaying) return;

    // Initialize mouse tracking
    setIsMouseInteracting(true);

    // Calculate totalMovementRef based on current video position
    // This ensures scrubbing continues from where playback stopped
    if (videoRef.current.currentTime > 0) {
      const videoDuration = videoLengthRef.current;
      const totalRequiredMovement = 5000;
      const currentProgress = videoRef.current.currentTime / videoDuration;
      totalMovementRef.current = currentProgress * totalRequiredMovement;
    }

    // Initialize with current mouse position
    lastMouseXRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseLeave = () => {
    setIsMouseInteracting(false);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (isPlaying) {
      // If currently playing, just pause
      video.pause();
      setIsPlaying(false);
    } else {
      // If not playing and reached end, restart from beginning
      if (hasReachedEnd) {
        video.currentTime = 0;
        setHasReachedEnd(false);
        totalMovementRef.current = 0;
      }

      // Start playing from current position
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Error playing video:", err);
        });
    }
  };

  return (
    <div className={styles.clipContainer}>
      <div className={styles.clipWrapper}>
        <div
          className={styles.videoContainer}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src={clip.src}
            playsInline
            preload="auto"
            onClick={(e) => e.stopPropagation()}
          />

          <div className={styles.clipOverlay}></div>
        </div>

        <div className={styles.bottomContent}>
          <button
            className={styles.playPauseButton}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className={styles.pauseIcon} viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className={styles.playIcon} viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {clip.caption && (
            <div className={styles.caption}>
              {clip.caption}
            </div>
          )}
        </div>
      </div>

      <div className={styles.arrowNavigation}>
        <button
          className={`${styles.navArrow} ${styles.leftArrow} ${isFirst ? styles.disabled : ''}`}
          aria-disabled={isFirst}
          onClick={() => {
            if (!isFirst && onPrevClip) {
              if (videoRef.current && isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              }
              onPrevClip();
            }
          }}
          disabled={isFirst}
        >
          &lt;
        </button>
        <button
          className={`${styles.navArrow} ${styles.rightArrow} ${isLast ? styles.disabled : ''}`}
          aria-disabled={isLast}
          onClick={() => {
            if (!isLast && onNextClip) {
              if (videoRef.current && isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              }
              onNextClip();
            }
          }}
          disabled={isLast}
        >
          &gt;
        </button>
      </div>

      {clip.description && (
        <div className={styles.description}>
          {clip.description}
        </div>
      )}
    </div>
  );
}