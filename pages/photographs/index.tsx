import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getAllPhotoAlbums } from '@/lib/api';
import { getMediaUrl } from '@/lib/mediaUrl';
import Link from 'next/link';
import type { PhotoAlbum } from '@/types';
import type { GetStaticProps } from 'next';

interface Props {
  albums: PhotoAlbum[];
}

export default function Photographs({ albums }: Props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Photographs | Ethan MacCumber</title>
        <meta name="description" content="Photography collections by Ethan MacCumber. Browse through curated albums of visual stories." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Photographs | Ethan MacCumber" />
        <meta property="og:description" content="Photography collections by Ethan MacCumber. Browse through curated albums of visual stories." />
        <meta property="og:url" content="https://ethanmaccumber.com/photographs" />
        <meta name="twitter:title" content="Photographs | Ethan MacCumber" />
        <meta name="twitter:description" content="Photography collections by Ethan MacCumber. Browse through curated albums of visual stories." />
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
              <Image 
                src={getMediaUrl(album.coverImage)} 
                alt={album.title} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const albums = getAllPhotoAlbums();
  return {
    props: { albums }
  };
};