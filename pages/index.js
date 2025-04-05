import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { getImageUrl } from '@/lib/backblaze'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethan MacCumber</title>
        <meta name="description" content="Photography and films by Ethan MacCumber" />
        <link rel="icon" href="/favicon.ico" />
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
          <Link href="/writing" className={styles.navLink}>
            writing
          </Link>
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        {/* Main featured image */}
        <div className={styles.featuredImageContainer}>
          <img
            src={getImageUrl("/images/featured.jpg")}
            alt="Featured photograph"
            className={styles.featuredImage}
          />
        </div>
      </main>
    </div>
  )
}