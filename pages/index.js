import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Personal Site</title>
        <meta name="description" content="Photography, videography, and blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to My Personal Site
        </h1>

        <p className={styles.description}>
          A showcase of photography, videography, and thoughts
        </p>

        <div className={styles.grid}>
          <Link href="/photography" className={styles.card}>
            <h2>Photography &rarr;</h2>
            <p>View my photography portfolio</p>
          </Link>

          <Link href="/videography" className={styles.card}>
            <h2>Videography &rarr;</h2>
            <p>Watch my video projects</p>
          </Link>

          <Link href="/blog" className={styles.card}>
            <h2>Blog &rarr;</h2>
            <p>Read my latest thoughts</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Created with speed and simplicity in mind</p>
      </footer>
    </div>
  )
}