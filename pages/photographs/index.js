import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Photographs() {
  // This would later be fetched from your content directory
  const collections = [
    {
      slug: 'nature',
      title: 'Nature Photography',
      coverImage: '/images/nature-cover.jpg'
    },
    {
      slug: 'urban',
      title: 'Urban Photography',
      coverImage: '/images/urban-cover.jpg'
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Photographs | Ethan MacCumber</title>
        <meta name="description" content="Photography collections by Ethan MacCumber" />
      </Head>

      <header className={styles.header}>
        <div className={styles.nameContainer}>
          <Link href="/" className={styles.name}>
            Ethan MacCumber
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/photographs" className={`${styles.navLink} ${styles.active}`}>
            photographs
          </Link>
          <Link href="/films" className={styles.navLink}>
            films
          </Link>
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.galleryContainer}>
        {collections.map((collection) => (
          <Link 
            href={`/photographs/${collection.slug}`} 
            key={collection.slug} 
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img 
                src={collection.coverImage} 
                alt={collection.title} 
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{collection.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}