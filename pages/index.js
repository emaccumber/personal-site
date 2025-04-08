import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import { getMediaUrl } from '@/lib/mediaUrl'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethan MacCumber</title>
        <meta name="description" content="Photography and films by Ethan MacCumber" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        {/* Main featured image */}
        <div className={styles.featuredImageContainer}>
          <img
            src={getMediaUrl('/images/featured.jpg')}
            alt="Featured photograph"
            className={styles.featuredImage}
          />
        </div>
      </main>
    </div>
  )
}