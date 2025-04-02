import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Information() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Information | Ethan MacCumber</title>
        <meta name="description" content="About Ethan MacCumber" />
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
          <Link href="/films" className={styles.navLink}>
            films
          </Link>
          <Link href="/information" className={`${styles.navLink} ${styles.active}`}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.bioContainer}>
          <h1 className={styles.bioTitle}>About Ethan MacCumber</h1>
          <div className={styles.bioContent}>
            <p>
              I am a photographer and filmmaker based in [Your Location]. My work focuses on [your focus/style/interests].
            </p>
            <p>
              [Add more about your background, approach, and interests]
            </p>
            <h2>Contact</h2>
            <p>
              Email: <a href="mailto:your.email@example.com">your.email@example.com</a><br />
              Instagram: <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">@yourusername</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}