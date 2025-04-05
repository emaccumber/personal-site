import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Writing.module.css';
import { getAllWritingPosts } from '@/lib/api';

export default function Writing({ posts }) {
  return (
    <Layout
      title="Writing"
      description="Writings by Ethan MacCumber"
      activeNav="writing"
    >
      <div className={styles.writingContainer}>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.slug} className={styles.postItem}>
              <Link href={`/writing/${post.slug}`} className={styles.postLink}>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postDate}>, {post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
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