import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Gallery.module.css';
import { getAllPhotoAlbums } from '@/lib/api';

export default function Photographs({ albums }) {
  return (
    <Layout
      title="Photographs"
      description="Photography collections by Ethan MacCumber"
      activeNav="photographs"
    >
      <div className={styles.galleryContainer}>
        {albums.map((album) => (
          <Link
            href={`/photographs/${album.slug}`}
            key={album.id}
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img
                src={album.coverImage}
                alt={album.title}
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{album.title}</h2>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const albums = getAllPhotoAlbums();
  return {
    props: { albums }
  };
}