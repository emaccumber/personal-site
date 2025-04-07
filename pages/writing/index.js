import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import writingStyles from '@/styles/Writing.module.css';
import Header from '@/components/Header';
import { getAllWritingPosts } from '@/lib/api';
import Link from 'next/link';

export default function Writing({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Writing | Ethan MacCumber</title>
        <meta name="description" content="Writings by Ethan MacCumber" />
      </Head>

      <Header />

      <main className={writingStyles.writingContainer}>
        <ul className={writingStyles.postList}>
          {posts.map((post) => (
            <li key={post.slug} className={writingStyles.postItem}>
              <Link href={`/writing/${post.slug}`} className={writingStyles.postLink}>
                <span className={writingStyles.postTitle}>{post.title}</span>
                <span className={writingStyles.postDate}>, {post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllWritingPosts();
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    props: { posts }
  };
}