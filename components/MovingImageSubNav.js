import React from 'react';
import Link from 'next/link';
import styles from '@/styles/AlbumSubNav.module.css'; // Reusing the existing styles for photos

export default function MovingImageSubNav({ albums, currentAlbum }) {
  return (
    <nav className={styles.albumSubNav}>
      {albums.map(album => (
        <Link
          key={album.slug}
          href={`/movingimages/${album.slug}`}
          className={`${styles.albumLink} ${album.slug === currentAlbum ? styles.active : ''}`}
        >
          {album.title}
        </Link>
      ))}
    </nav>
  );
}