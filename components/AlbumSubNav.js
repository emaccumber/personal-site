import React from 'react';
import Link from 'next/link';
import styles from '@/styles/AlbumSubNav.module.css';

export default function AlbumSubNav({ albums, currentAlbum }) {
  return (
    <nav className={styles.subNav}>
      {albums.map((album) => (
        <Link 
          href={`/photographs/${album.slug}`} 
          key={album.id}
          className={`${styles.subNavLink} ${currentAlbum === album.slug ? styles.active : ''}`}
        >
          {album.title}
        </Link>
      ))}
    </nav>
  );
}