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
  const isFirst = clipIndex === 0;
  const isLast = clipIndex === totalClips - 1;

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

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, []);

  const handleClipClick = () => {
    if (!isLast) {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      if (onNextClip) onNextClip();
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.clipContainer}>
      <div className={styles.clipWrapper}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            src={clip.src}
            poster={clip.poster}
            playsInline
            onClick={(e) => e.stopPropagation()} // Prevent the video click from triggering clip click
          />
          <div 
            className={`${styles.clipOverlay} ${!isLast ? styles.clickable : ''}`}
            onClick={handleClipClick}
          ></div>
        </div>
        
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