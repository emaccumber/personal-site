import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import videoStyles from '@/styles/VideoThumbnail.module.css';

interface Props {
  src: string;
  alt: string;
  filmSlug: string;
}

export default function VideoThumbnail({ src, alt, filmSlug }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Simply play on hover (desktop only)
  const handleMouseEnter = () => {
    if (isMobile) return; // Disable on mobile
    
    const video = videoRef.current;
    if (!video || hasEnded) return;
    
    // Reset video to beginning if it's at the end
    if (video.currentTime >= video.duration - 0.1) {
      video.currentTime = 0;
    }
    
    // Play video
    video.play();
  };
  
  // Simply pause on leave (desktop only)
  const handleMouseLeave = () => {
    if (isMobile) return; // Disable on mobile
    
    const video = videoRef.current;
    if (!video) return;
    
    // Pause video
    video.pause();
  };
  
  // Handle when video ends
  const handleEnded = () => {
    setHasEnded(true);
    
    // Make sure it stays on the last frame
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = video.duration;
    }
  };

  return (
    <div
      className={`${styles.galleryImageContainer} ${videoStyles.videoThumbnailContainer}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className={`${styles.galleryImage} ${videoStyles.videoThumbnail} ${hasEnded ? videoStyles.ended : ''}`}
        src={src}
        playsInline
        muted
        autoPlay={false}
        loop={false}
        onEnded={handleEnded}
      />
    </div>
  );
}