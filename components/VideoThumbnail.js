import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { getMediaUrl } from '@/lib/mediaUrl';
import ClientOnly from '@/components/ClientOnly';
import debug from '@/lib/debug';

export default function VideoThumbnail({ film }) {
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [fallbackToImage, setFallbackToImage] = useState(false);
  
  // Get the correct slug for the video path (removing "moving-image-" prefix if present)
  const videoSlug = film.slug.replace(/^moving-image-/, '');
  
  // The path to the video thumbnail - use exact slug without any modifications
  const videoPath = `/videos/films/${videoSlug}/cover.mp4`;
  const videoSrc = getMediaUrl(videoPath);
  const imageSrc = getMediaUrl(film.coverImage);
  
  // Debug: Log the path being used
  useEffect(() => {
    // Force enable debug for critical path information
    const oldDebugState = debug.isEnabled();
    debug.setEnabled(true);
    
    console.log(`VideoThumbnail for ${film.title}:`, {
      originalSlug: film.slug,
      videoSlug: videoSlug,
      videoPath: videoPath,
      videoSrc: videoSrc,
      imagePath: film.coverImage,
      imageSrc: imageSrc
    });
    
    // Check if file exists (client-side)
    if (typeof window !== 'undefined') {
      // Create an XMLHttpRequest to check if the file exists
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', videoSrc, true);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          console.log(`✅ Video file EXISTS: ${videoSrc}`);
        } else {
          console.error(`❌ Video file NOT FOUND: ${videoSrc}`);
          console.error(`Make sure you have a cover.mp4 file in: /public/videos/films/${videoSlug}/`);
          setFallbackToImage(true);
        }
      };
      xhr.send();
    }
    
    // Restore previous debug state
    debug.setEnabled(oldDebugState);
  }, [film, videoPath, videoSrc, imageSrc, videoSlug]);
  
  // Handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovering(true);
    debug.log(`Mouse enter on ${film.title} thumbnail`);
    
    if (videoRef.current && !hasEnded) {
      // Play the video when mouse enters
      debug.log(`Attempting to play ${film.title} video`);
      
      // Ensure the video is reset to the beginning if it was paused
      if (videoRef.current.currentTime > 0 && !videoRef.current.ended) {
        // Only reset if it was paused mid-way
        videoRef.current.currentTime = 0;
      }
      
      const playPromise = videoRef.current.play();
      
      // Handle potential play() promise rejection (browser policy)
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          debug.error(`Video play failed for ${film.title}:`, error);
          
          // If autoplay is blocked by browser policy, try setting muted again and replay
          if (error.name === 'NotAllowedError') {
            videoRef.current.muted = true;
            const retryPlay = videoRef.current.play();
            retryPlay.catch(retryError => {
              debug.error(`Retry play failed for ${film.title}:`, retryError);
              setFallbackToImage(true);
            });
          } else {
            setFallbackToImage(true);
          }
        });
      }
    }
  };
  
  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovering(false);
    debug.log(`Mouse leave on ${film.title} thumbnail`);
    
    if (videoRef.current && !hasEnded) {
      // Pause the video when mouse leaves
      videoRef.current.pause();
    }
  };
  
  // Handle video end event
  const handleVideoEnded = () => {
    debug.log(`Video ended for ${film.title}`);
    setHasEnded(true);
    // Video will remain on the last frame
  };
  
  // Handle video loading error
  const handleVideoError = (e) => {
    debug.error(`Video for ${film.slug} failed to load:`, e);
    debug.error(`Video src was: ${videoSrc}`);
    setFallbackToImage(true);
  };
  
  // Handle video loaded metadata
  const handleVideoLoadedMetadata = () => {
    debug.log(`Video metadata loaded for ${film.title}`);
    setIsVideoLoaded(true);
  };
  
  // Load the video immediately on component mount
  useEffect(() => {
    if (videoRef.current) {
      debug.log(`Initial loading of video for ${film.title}`);
      videoRef.current.load();
    }
  }, [film.title]);
  
  // Effect to add and remove event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      debug.log(`Setting up event listeners for ${film.title} video`);
      videoElement.addEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('error', handleVideoError);
      videoElement.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
      
      // Set poster image to match the cover image for better loading appearance
      videoElement.poster = imageSrc;
      
      // Make sure video is initially paused and at the start
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.muted = true; // Ensure muted for autoplay compatibility
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnded);
        videoElement.removeEventListener('error', handleVideoError);
        videoElement.removeEventListener('loadedmetadata', handleVideoLoadedMetadata);
      }
    };
  }, [film.title, imageSrc, handleVideoEnded, handleVideoError, handleVideoLoadedMetadata]);
  
  const videoStyle = {
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    opacity: isVideoLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };
  
  const imageStyle = {
    display: 'block',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    opacity: fallbackToImage ? 1 : (isVideoLoaded ? 0 : 1),
    transition: 'opacity 0.3s ease'
  };
  
  return (
    <ClientOnly fallback={
      <div className={styles.galleryImageContainer}>
        <img
          src={imageSrc}
          alt={film.title}
          className={styles.galleryImage}
        />
      </div>
    }>
      <div 
        className={styles.galleryImageContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Show fallback image if video fails to load or before video loads */}
        {(fallbackToImage || !isVideoLoaded) && (
          <img
            src={imageSrc}
            alt={film.title}
            style={imageStyle}
          />
        )}
        
        {/* Video element */}
        {!fallbackToImage && (
          <video
            ref={videoRef}
            style={videoStyle}
            muted
            playsInline
            preload="auto"
            poster={imageSrc}
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </ClientOnly>
  );
}