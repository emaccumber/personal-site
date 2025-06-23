import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/ClipView.module.css';
import { getMediaUrl } from '@/lib/mediaUrl';

export default function PreloadedClipView({
  clips,
  currentClipIndex,
  onNextClip,
  onPrevClip
}) {
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isMouseInteracting, setIsMouseInteracting] = useState(false);
  const [videoDurations, setVideoDurations] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseMovementRef = useRef(0);
  const lastMouseXRef = useRef({ x: 0, y: 0 });
  const totalMovementRef = useRef(0);
  
  const totalClips = clips.length;
  const isFirst = currentClipIndex === 0;
  const isLast = currentClipIndex === totalClips - 1;
  const currentClip = clips[currentClipIndex];

  // Set mounted state to true after initial render and detect mobile
  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Initialize video refs
  useEffect(() => {
    if (!isMounted) return;
    videoRefs.current = videoRefs.current.slice(0, clips.length);
  }, [clips, isMounted]);
  
  // Store video durations and set up event listeners
  useEffect(() => {
    if (!isMounted) return;
    
    const durations = [];
    
    clips.forEach((_, index) => {
      const video = videoRefs.current[index];
      if (!video) return;
      
      // Store duration when metadata is loaded
      const handleLoadedMetadata = () => {
        durations[index] = video.duration;
        setVideoDurations([...durations]);
      };
      
      // Reset all videos to beginning
      video.currentTime = 0;
      
      // Add event listeners
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // If this is the current clip, add ended event
      if (index === currentClipIndex) {
        const handleEnded = () => {
          setIsPlaying(false);
          setHasReachedEnd(true);
        };
        
        video.addEventListener('ended', handleEnded);
        
        return () => {
          video.removeEventListener('ended', handleEnded);
        };
      }
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    });
  }, [clips, currentClipIndex, isMounted]);
  
  // Reset state when clip changes
  useEffect(() => {
    if (!isMounted) return;
    
    // Pause previous video if playing
    if (isPlaying) {
      const previousVideo = videoRefs.current[currentClipIndex];
      if (previousVideo) {
        previousVideo.pause();
      }
    }
    
    // Reset state for new clip
    setIsPlaying(false);
    setHasReachedEnd(false);
    totalMovementRef.current = 0;
    
    // Reset current video position
    const currentVideo = videoRefs.current[currentClipIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
    }
  }, [currentClipIndex, isMounted]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isMounted) return;
    
    const handleKeyDown = (e) => {
      // Right arrow key navigates to next clip
      if (e.key === 'ArrowRight' && !isLast) {
        if (isPlaying) {
          const video = videoRefs.current[currentClipIndex];
          if (video) {
            video.pause();
          }
          setIsPlaying(false);
        }
        if (onNextClip) onNextClip();
      }
      // Left arrow key navigates to previous clip
      else if (e.key === 'ArrowLeft' && !isFirst) {
        if (isPlaying) {
          const video = videoRefs.current[currentClipIndex];
          if (video) {
            video.pause();
          }
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
  }, [currentClipIndex, isFirst, isLast, isPlaying, onNextClip, onPrevClip, isMounted]);
  
  // Mouse movement handler for frame-by-frame scrubbing (desktop only)
  const handleMouseMove = (e) => {
    if (isMobile || isPlaying || !isMouseInteracting) return;
    
    const video = videoRefs.current[currentClipIndex];
    if (!video) return;
    
    // Calculate distance moved
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
      const videoDuration = videoDurations[currentClipIndex] || 0;
      
      // We want to go through the entire clip with more movement for slower frame changes
      const totalRequiredMovement = 5000;
      const progress = Math.min(totalMovementRef.current / totalRequiredMovement, 1.0);
      
      // Set absolute time position
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
    if (isMobile || isPlaying) return;
    
    // Initialize mouse tracking
    setIsMouseInteracting(true);
    
    const video = videoRefs.current[currentClipIndex];
    if (video && video.currentTime > 0) {
      const videoDuration = videoDurations[currentClipIndex] || 0;
      const totalRequiredMovement = 5000;
      const currentProgress = video.currentTime / videoDuration;
      totalMovementRef.current = currentProgress * totalRequiredMovement;
    }
    
    // Initialize with current mouse position
    lastMouseXRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsMouseInteracting(false);
    }
  };
  
  const togglePlayPause = () => {
    const video = videoRefs.current[currentClipIndex];
    if (!video) return;
    
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
    <div className={styles.clipContainer} style={{ marginBottom: '30px' }}>
      <div 
        className={styles.clipWrapper}
        ref={containerRef}
        style={{
          // Set a fixed aspect ratio container to prevent layout shifts
          position: 'relative',
          paddingBottom: '75%', // 4:3 aspect ratio (was 56.25% for 16:9)
          height: 0,
          overflow: 'hidden'
        }}
      >
        <div
          className={styles.videoContainer}
          onMouseMove={isMobile ? undefined : handleMouseMove}
          onMouseEnter={isMobile ? undefined : handleMouseEnter}
          onMouseLeave={isMobile ? undefined : handleMouseLeave}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* Render all videos but only show the current one */}
          {clips.map((clip, index) => (
            <video
              key={`video-${index}`}
              ref={el => videoRefs.current[index] = el}
              className={styles.video}
              src={getMediaUrl(clip.src)}
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: index === currentClipIndex ? 'block' : 'none'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
          
          <div className={styles.clipOverlay}></div>
        </div>
      </div>
      
      {/* Controls and caption moved outside the clipWrapper */}
      <div 
        className={styles.bottomContent}
        style={{
          marginTop: '5px',  /* Reduced from 10px to place closer to the clip */
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
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
        
        {currentClip && currentClip.caption && (
          <div 
            className={styles.caption}
            style={{ 
              textAlign: 'right',
              marginLeft: 'auto'
            }}
          >
            {currentClip.caption}
          </div>
        )}
      </div>
      
      <div className={styles.arrowNavigation}>
        <button
          className={`${styles.navArrow} ${styles.leftArrow} ${isFirst ? styles.disabled : ''}`}
          aria-disabled={isFirst}
          onClick={() => {
            if (!isFirst && onPrevClip) {
              if (isPlaying) {
                const video = videoRefs.current[currentClipIndex];
                if (video) {
                  video.pause();
                }
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
              if (isPlaying) {
                const video = videoRefs.current[currentClipIndex];
                if (video) {
                  video.pause();
                }
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
      
      {currentClip && currentClip.description && (
        <div 
          className={styles.description}
          style={{ marginTop: '20px' }}
        >
          {currentClip.description}
        </div>
      )}
    </div>
  );
}