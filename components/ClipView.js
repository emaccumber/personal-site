import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/ClipView.module.css';

export default function ClipView({
  clip,
  clipIndex,
  totalClips,
  onNextClip,
  onPrevClip
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const isFirst = clipIndex === 0;
  const isLast = clipIndex === totalClips - 1;

  // Initialize video when clip changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset state when clip changes
    setIsVideoReady(false);
    setIsPlaying(false);

    const handleLoadedData = () => {
      video.currentTime = 0;
      setIsVideoReady(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);

    // Handle video end
    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [clip.src]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Right arrow key navigates to next clip
      if (e.key === 'ArrowRight' && !isLast) {
        pauseAndNavigate(onNextClip);
      }
      // Left arrow key navigates to previous clip
      else if (e.key === 'ArrowLeft' && !isFirst) {
        pauseAndNavigate(onPrevClip);
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

  // Helper function to pause video and navigate
  const pauseAndNavigate = (navigationFn) => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    if (navigationFn) navigationFn();
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current || !isVideoReady) return;

    const video = videoRef.current;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      // If at the end, restart from beginning
      if (video.currentTime >= video.duration - 0.1) {
        video.currentTime = 0;
      }

      // Start playing
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing video:", err));
    }
  };

  return (
    <div className={styles.clipContainer}>
      <div className={styles.clipWrapper}>
        <div className={styles.videoContainer}>
          {!isVideoReady && (
            <div className={styles.loadingIndicator}>
              <span>Loading clip...</span>
            </div>
          )}

          <video
            ref={videoRef}
            className={`${styles.video} ${isVideoReady ? styles.videoReady : styles.videoLoading}`}
            src={clip.src}
            playsInline
            preload="auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className={styles.bottomContent}>
          <button
            className={`${styles.playPauseButton} ${isVideoReady ? '' : styles.disabled}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!isVideoReady}
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
          onClick={() => !isFirst && pauseAndNavigate(onPrevClip)}
          disabled={isFirst}
        >
          &lt;
        </button>
        <button
          className={`${styles.navArrow} ${styles.rightArrow} ${isLast ? styles.disabled : ''}`}
          aria-disabled={isLast}
          onClick={() => !isLast && pauseAndNavigate(onNextClip)}
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