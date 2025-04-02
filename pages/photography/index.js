import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { getAllPhotoCollections } from '@/lib/api'

export default function Photography({ collections }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Photography | My Personal Site</title>
        <meta name="description" content="Photography portfolio" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Photography</h1>
        
        <div className={styles.grid}>
          {collections.map((collection) => (
            <Link href={`/photography/${collection.slug}`} key={collection.slug} className={styles.card}>
              <h2>{collection.title} &rarr;</h2>
              <p>{collection.description}</p>
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
  const collections = getAllPhotoCollections()
  return {
    props: { collections }
  }
}