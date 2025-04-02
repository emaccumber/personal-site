import React from 'react';
import styles from '@/styles/VimeoPlayer.module.css';

export default function VimeoPlayer({ vimeoId }) {
  return (
    <div className={styles.playerContainer}>
      <iframe 
        src={`https://player.vimeo.com/video/${vimeoId}`}
        className={styles.player}
        frameBorder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowFullScreen
        title="Vimeo video player"
      ></iframe>
    </div>
  );
}