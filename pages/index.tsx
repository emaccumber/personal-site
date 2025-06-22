import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import { getMediaUrl } from '@/lib/mediaUrl'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethan MacCumber - Photographer & Filmmaker</title>
        <meta name="description" content="Photography and films by Ethan MacCumber. Explore visual storytelling through photographs and moving images." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Ethan MacCumber - Photographer & Filmmaker" />
        <meta property="og:description" content="Photography and films by Ethan MacCumber. Explore visual storytelling through photographs and moving images." />
        <meta property="og:image" content={getMediaUrl('/images/featured.jpg')} />
        <meta property="og:url" content="https://ethanmaccumber.com" />
        <meta name="twitter:title" content="Ethan MacCumber - Photographer & Filmmaker" />
        <meta name="twitter:description" content="Photography and films by Ethan MacCumber. Explore visual storytelling through photographs and moving images." />
        <meta name="twitter:image" content={getMediaUrl('/images/featured.jpg')} />
      </Head>

      <Header />

      <main className={styles.main}>
        {/* Main featured image */}
        <div className={styles.featuredImageContainer}>
          <Image
            src={getMediaUrl('/images/featured.jpg')}
            alt="Featured photograph"
            fill
            className={styles.featuredImage}
            priority
          />
        </div>
      </main>
    </div>
  )
}