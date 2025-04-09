import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getAllFilms } from '@/lib/api';
import { getMediaUrl } from '@/lib/mediaUrl';
import Link from 'next/link';
import VideoThumbnail from '@/components/VideoThumbnail';
import { useEffect, useState } from 'react';

export default function Films({ films }) {
  // Start with hasVideoCovers as an empty object, not assuming any videos exist yet
  const [hasVideoThumbnails, setHasVideoThumbnails] = useState({});
  // Assume videos are loading when the page first loads
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  useEffect(() => {
    console.log('[Films] Films data:', films);
    console.log('[Films] Checking for video covers for', films.length, 'films');
    setIsLoadingVideos(true);

    // Create a copy of the current state to update
    const videoStatus = {};
    let pendingChecks = films.length;

    // Store timeouts to clear on unmount
    const timeouts = [];

    // Function to mark a check as complete
    const completeCheck = () => {
      pendingChecks--;
      if (pendingChecks === 0) {
        setHasVideoThumbnails(videoStatus);
        setIsLoadingVideos(false);
        console.log('[Films] All video checks complete:', videoStatus);
      }
    };

    // Check each film for a video cover
    films.forEach(film => {
      // Default to non-video until we confirm it's a video
      videoStatus[film.slug] = false;
      
      // Check if coverImage is a video file
      const isVideoFile = film.coverImage.toLowerCase().endsWith('.mp4') || 
                          film.coverImage.toLowerCase().endsWith('.webm') ||
                          film.coverImage.toLowerCase().endsWith('.mov');
      
      if (!isVideoFile) {
        console.log(`[Films] Image coverImage for ${film.slug}, not using video thumbnail`);
        completeCheck();
        return;
      }

      const coverUrl = film.coverImage;
      console.log(`[Films] Checking video for ${film.slug} at ${coverUrl}`);

      // Create a video element to test if the file exists
      const video = document.createElement('video');

      // Set up event handlers before setting src to avoid race conditions
      video.onloadeddata = () => {
        console.log(`[Films] Video found for ${film.slug}`);
        videoStatus[film.slug] = true;
        completeCheck();
      };

      video.onerror = () => {
        console.log(`[Films] No video found at ${coverUrl} for ${film.slug}`);
        videoStatus[film.slug] = false;
        completeCheck();
      };

      // Set a timeout to handle cases where the video might hang
      const timeoutId = setTimeout(() => {
        if (pendingChecks > 0) {
          console.log(`[Films] Timeout checking video for ${film.slug}`);
          // If this film hasn't been processed yet, mark it as no video
          if (videoStatus[film.slug] !== true) {
            videoStatus[film.slug] = false;
            completeCheck();
          }
        }
      }, 2000); // 2 second timeout

      timeouts.push(timeoutId);

      // Set the source to trigger the checks
      video.muted = true;
      video.preload = 'metadata';
      video.src = getMediaUrl(coverUrl);
    });

    // Cleanup function
    return () => {
      console.log('[Films] Cleaning up video cover checks');
      timeouts.forEach(id => clearTimeout(id));
    };
  }, [films]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Films | Ethan MacCumber</title>
        <meta name="description" content="Films by Ethan MacCumber" />
      </Head>

      <Header />

      <main className={styles.galleryContainer}>
        {films.map((film) => (
          <Link
            href={`/films/${film.slug}`}
            key={film.id}
            className={styles.galleryItem}
          >
            {isLoadingVideos || !hasVideoThumbnails[film.slug] ? (
              // Show regular image
              <div className={styles.galleryImageContainer}>
                <img
                  src={getMediaUrl(film.coverImage)}
                  alt={film.title}
                  className={styles.galleryImage}
                />
              </div>
            ) : (
              // Video thumbnail if available and loading complete
              <VideoThumbnail
                src={getMediaUrl(film.coverImage)}
                alt={film.title}
                filmSlug={film.slug}
              />
            )}
            <h2 className={styles.galleryTitle}>{film.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const films = getAllFilms();
  console.log("Films data:", JSON.stringify(films, null, 2));
  return {
    props: { films }
  };
}