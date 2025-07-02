import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import writingStyles from '@/styles/Writing.module.css';
import Header from '@/components/Header';
import { getWritingPosts } from '@/lib/mdx';
import Link from 'next/link';

export default function Writing({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Writing | Ethan MacCumber</title>
        <meta name="description" content="Essays and writings by Ethan MacCumber on photography, film, and visual culture." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Writing | Ethan MacCumber" />
        <meta property="og:description" content="Essays and writings by Ethan MacCumber on photography, film, and visual culture." />
        <meta property="og:url" content="https://ethanmaccumber.com/writing" />
        <meta name="twitter:title" content="Writing | Ethan MacCumber" />
        <meta name="twitter:description" content="Essays and writings by Ethan MacCumber on photography, film, and visual culture." />
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
  const posts = await getWritingPosts();
  
  return {
    props: { posts }
  };
}