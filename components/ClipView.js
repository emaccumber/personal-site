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
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isMouseInteracting, setIsMouseInteracting] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mouseMovementRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const videoLengthRef = useRef(0);
  
  const isFirst = clipIndex === 0;
  const isLast = clipIndex === totalClips - 1;

  // Load video metadata to get duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video and state when clip changes
    setIsVideoReady(false);
    setHasReachedEnd(false);
    setIsPlaying(false);
    
    const handleLoadedMetadata = () => {
      videoLengthRef.current = video.duration;
      // Set first frame as poster by seeking to time 0
      video.currentTime = 0;
    };
    
    const handleLoadedData = () => {
      // Once data is loaded and currentTime has been set to 0, 
      // the video should be showing its first frame
      setIsVideoReady(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [clip]);

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
    if (!videoRef.current || isPlaying || !isMouseInteracting || !isVideoReady) return;
    
    const video = videoRef.current;
    const container = containerRef.current;
    if (!container) return;
    
    // Calculate distance moved
    const currentX = e.clientX;
    const deltaX = currentX - lastMouseXRef.current;
    
    // Only advance on right movement
    if (deltaX > 0 && !hasReachedEnd) {
      // Calculate sensitivity - how many pixels to move for one frame
      // Assuming ~30fps video, we want to move through the entire video in about 300-500px of horizontal movement
      const frameDuration = 1/30; // Approximate duration of one frame at 30fps
      const videoDuration = videoLengthRef.current;
      const totalFrames = videoDuration / frameDuration;
      const sensitivity = 300 / totalFrames; // Adjust this for slower/faster scrubbing
      
      // Calculate how much to advance
      const advanceAmount = (deltaX * sensitivity) / videoDuration;
      
      if (video.currentTime + advanceAmount >= video.duration) {
        // We've reached the end
        video.currentTime = video.duration;
        setHasReachedEnd(true);
      } else {
        // Advance by calculated amount
        video.currentTime += advanceAmount;
      }
    }
    
    lastMouseXRef.current = currentX;
  };

  const handleMouseEnter = () => {
    if (!videoRef.current || isPlaying || !isVideoReady) return;
    
    // Initialize mouse tracking
    setIsMouseInteracting(true);
    lastMouseXRef.current = 0; // Reset mouse position tracking
  };

  const handleMouseLeave = () => {
    setIsMouseInteracting(false);
  };

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
    if (!videoRef.current || !isVideoReady) return;
    
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
      <div 
        className={styles.clipWrapper}
        ref={containerRef}
      >
        <div 
          className={styles.videoContainer}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
            onClick={(e) => e.stopPropagation()} // Prevent the video click from triggering clip click
          />
          
          <div 
            className={`${styles.clipOverlay} ${!isLast ? styles.clickable : ''}`}
            onClick={handleClipClick}
          ></div>
          
          {!isPlaying && isVideoReady && (
            <div className={`${styles.scrubIndicator} ${isMouseInteracting && !hasReachedEnd ? styles.active : ''}`}>
              <span>Move mouse right to scrub through clip</span>
            </div>
          )}
        </div>
        
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