import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getAllPhotoAlbums } from '@/lib/api';
import { getMediaUrl } from '@/lib/mediaUrl';
import Link from 'next/link';

export default function Photographs({ albums }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Photographs | Ethan MacCumber</title>
        <meta name="description" content="Photography collections by Ethan MacCumber" />
      </Head>

      <Header />

      <main className={styles.galleryContainer}>
        {albums.map((album) => (
          <Link 
            href={`/photographs/${album.slug}`} 
            key={album.id} 
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img 
                src={getMediaUrl(album.coverImage)} 
                alt={album.title} 
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{album.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const albums = getAllPhotoAlbums();
  return {
    props: { albums }
  };
}