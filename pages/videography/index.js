import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { getAllVideos } from '@/lib/api'

export default function Videography({ videos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Videography | My Personal Site</title>
        <meta name="description" content="Videography showcase" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Videography</h1>
        
        <div className={styles.grid}>
          {videos.map((video) => (
            <Link href={`/videography/${video.slug}`} key={video.slug} className={styles.card}>
              <h2>{video.title} &rarr;</h2>
              <p>{video.description}</p>
            </Link>
          ))}
        </div>
        
        <p>
          <Link href="/">Back to home</Link>
        </p>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const videos = getAllVideos()
  return {
    props: { videos }
  }
}