import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Films() {
  // This would later be fetched from your content directory
  const films = [
    {
      slug: 'documentary',
      title: 'Short Documentary',
      coverImage: '/images/documentary-cover.jpg'
    },
    {
      slug: 'travel',
      title: 'Travel Montage',
      coverImage: '/images/travel-cover.jpg'
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Films | Ethan MacCumber</title>
        <meta name="description" content="Films by Ethan MacCumber" />
      </Head>

      <header className={styles.header}>
        <div className={styles.nameContainer}>
          <Link href="/" className={styles.name}>
            Ethan MacCumber
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/photographs" className={styles.navLink}>
            photographs
          </Link>
          <Link href="/films" className={`${styles.navLink} ${styles.active}`}>
            films
          </Link>
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.galleryContainer}>
        {films.map((film) => (
          <Link 
            href={`/films/${film.slug}`} 
            key={film.slug} 
            className={styles.galleryItem}
          >
            <div className={styles.galleryImageContainer}>
              <img 
                src={film.coverImage} 
                alt={film.title} 
                className={styles.galleryImage}
              />
            </div>
            <h2 className={styles.galleryTitle}>{film.title}</h2>
          </Link>
        ))}
      </main>
    </div>
  );
}