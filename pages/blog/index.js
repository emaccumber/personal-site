import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { getAllPosts } from '@/lib/api'

export default function Blog({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog | My Personal Site</title>
        <meta name="description" content="Personal blog" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Blog</h1>
        
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.card}>
              <h2>{post.title} &rarr;</h2>
              <p>{post.excerpt}</p>
              <p className={styles.date}>{post.date}</p>
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
  const posts = getAllPosts()
  return {
    props: { posts }
  }
}